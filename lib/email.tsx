export async function sendAccessEmail(
  email: string,
  username: string,
  gitHubRepo: string,
  dockerImage: string,
  dockerToken: string
): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    throw new Error('Resend API key not configured')
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM_NAME || 'Evolution API  Pro <onboarding@resend.dev>',
        to: email,
        subject: 'Evolution API PRO - Your Private Repository Access is Ready',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .section { margin-bottom: 25px; }
                .label { font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .value { background: white; padding: 12px 16px; border-left: 3px solid #667eea; margin-top: 8px; font-family: 'Courier New', monospace; word-break: break-all; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 10px; font-weight: 600; }
                .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Welcome!</h1>
                  <p>Your access request has been approved, ${username}</p>
                </div>
                <div class="content">
                  <div class="section">
                    <div class="label">GitHub Repository Access</div>
                    <div class="value">${gitHubRepo}</div>
                    <p style="color: #666; font-size: 14px; margin-top: 8px;">You've been added as a collaborator to this private repository.</p>
                  </div>

                  <div class="section">
                    <div class="label">Docker Hub Credentials</div>
                    <p style="color: #666; margin: 10px 0;">Username: <strong>${process.env.DOCKER_HUB_USERNAME}</strong></p>
                    <div style="background: white; padding: 12px 16px; border-left: 3px solid #667eea; margin-top: 8px;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">Token:</p>
                      <p style="margin: 0; font-family: 'Courier New', monospace; word-break: break-all; font-size: 13px;">${dockerToken}</p>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 12px;">Use these credentials to pull the private Docker image: <strong>${dockerImage}</strong></p>
                  </div>

                  <div class="section">
                    <div class="label">Pull Docker Image</div>
                    <div class="value">docker pull ${dockerImage}</div>
                  </div>

                  <div class="section" style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 3px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>⚠️ Security Note:</strong> Keep these credentials safe and don't share them publicly.</p>
                  </div>

                  <div class="footer">
                    <p>If you have any questions, please contact our support team.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Resend API error: ${error.message}`)
    }
  } catch (error) {
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}
