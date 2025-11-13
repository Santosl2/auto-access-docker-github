export async function grantGitHubAccess(username: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN
  const repoOwner = process.env.GITHUB_REPO_OWNER
  const repoName = process.env.GITHUB_REPO_NAME

  if (!token || !repoOwner || !repoName) {
    throw new Error('GitHub credentials not configured')
  }

  const allRepos = repoName.split(',')

  try {
    const promises = allRepos.map(async repo => {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${username}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            permission: 'pull',
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`GitHub API error: ${error.message}`)
      }

      return response
    })

    await Promise.all(promises)

    return `Successfully granted access to ${username} for repositories: ${allRepos.join(', ')}`
  } catch (error) {
    throw new Error(
      `Failed to grant GitHub access: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}
