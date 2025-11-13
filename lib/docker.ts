export async function generateDockerToken(username: string): Promise<string> {
  const dockerHubUsername = process.env.DOCKER_HUB_USERNAME
  const dockerHubToken = process.env.DOCKER_HUB_TOKEN

  if (!dockerHubUsername || !dockerHubToken) {
    throw new Error('Docker Hub credentials not configured')
  }

  try {
    // Authenticate with Docker Hub
    const authResponse = await fetch('https://hub.docker.com/v2/users/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: dockerHubUsername,
        password: dockerHubToken,
      }),
    })

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Docker Hub')
    }

    const authData = await authResponse.json()
    const accessToken = authData.token

    // Create a new personal access token for the user
    const tokenName = `access-${username}-${Date.now()}`
    const tokenResponse = await fetch(
      `https://hub.docker.com/v2/users/${dockerHubUsername}/tokens/`,
      {
        method: 'POST',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_label: tokenName,
          token_description: `Token generated for ${username}`,
        }),
      }
    )

    if (!tokenResponse.ok) {
      throw new Error('Failed to create Docker Hub token')
    }

    const tokenData = await tokenResponse.json()
    return tokenData.token
  } catch (error) {
    throw new Error(
      `Failed to generate Docker token: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
