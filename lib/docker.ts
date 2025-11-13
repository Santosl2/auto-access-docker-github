export async function generateDockerToken(username: string): Promise<string> {
  const dockerHubUsername = process.env.DOCKER_HUB_USERNAME
  const dockerHubToken = process.env.DOCKER_HUB_TOKEN

  if (!dockerHubUsername || !dockerHubToken) {
    throw new Error('Docker Hub credentials not configured')
  }

  try {
    // Authenticate with Docker Hub
    const authResponse = await fetch('https://hub.docker.com/v2/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: dockerHubUsername,
        secret: dockerHubToken,
      }),
    })

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Docker Hub')
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

    const expiresAtToken = sixMonthsFromNow.toISOString() // 6 months from now
    // Create a new personal access token for the user
    const tokenName = `access-${username}-${Date.now()}`
    const tokenResponse = await fetch(
      'https://hub.docker.com/v2/access-tokens',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_label: tokenName,
          scopes: ['repo:read'],
          expires_at: expiresAtToken,
        }),
      }
    )

    if (!tokenResponse.ok) {
      throw new Error(
        `Failed to create Docker Hub token${await tokenResponse.text()}`
      )
    }

    const tokenData = await tokenResponse.json()
    return tokenData.token
  } catch (error) {
    throw new Error(
      `Failed to generate Docker token: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
