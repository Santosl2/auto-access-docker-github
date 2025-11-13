import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { grantGitHubAccess } from "@/lib/github"
import { generateDockerToken } from "@/lib/docker"
import { sendAccessEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { github_username, email } = body

    if (!github_username || !email) {
      return NextResponse.json({ error: "GitHub username and email are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert access request
    const { data: insertedData, error: insertError } = await supabase
      .from("access_requests")
      .insert({
        github_username,
        email,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message || "Failed to create request" }, { status: 400 })
    }

    try {
      // Grant GitHub access
      await grantGitHubAccess(github_username)

      // Generate Docker token
      const dockerToken = await generateDockerToken(github_username)

      // Send email with credentials
      await sendAccessEmail(
        email,
        github_username,
        `${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}`,
        process.env.DOCKER_HUB_REPO || "your-docker-image",
        dockerToken,
      )

      // Update request status and store tokens
      const { error: updateError } = await supabase
        .from("access_requests")
        .update({
          status: "approved",
          docker_token: dockerToken,
        })
        .eq("id", insertedData.id)

      if (updateError) {
        console.error("Failed to update request:", updateError)
      }

      return NextResponse.json({ success: true, message: "Access granted and email sent" }, { status: 201 })
    } catch (integrationError) {
      // Update status to failed if any integration fails
      await supabase.from("access_requests").update({ status: "failed" }).eq("id", insertedData.id)

      return NextResponse.json(
        { error: integrationError instanceof Error ? integrationError.message : "Integration failed" },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("access_requests").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
