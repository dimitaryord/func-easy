import api from "@/utils/api"
import { createClient } from "@supabase/supabase-js"
import type { Repository } from "@/schemas/github"

export const supabaseClient = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
)

function getScopesByProvider(provider: "github" | "gitlab" | "bitbucket") {
  switch (provider) {
    case "github":
      return "repo user"
    case "gitlab":
      return "api read_user read_repository read_api"
    case "bitbucket":
      return "repository account"
    default:
      throw new Error("Invalid provider")
  }
}
export async function signInWithGitProviders(
  provider: "github" | "gitlab" | "bitbucket",
) {
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${import.meta.env.PUBLIC_BASE_URL}/auth/callback?provider=${provider}`,
        scopes: getScopesByProvider(provider),
      },
    })
    if (error) {
      console.error("Error signing in with Git provider:", error)
    }
  } catch (error) {
    console.error("Error signing in with Git provider:", error)
  }
}

export const fetchGitHubRepos = async (): Promise<Repository[] | undefined> => {
  const accessToken = localStorage.getItem("github_oauth_provider_token")

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  try {
    const repos = await api.get<Repository[]>(
      "https://api.github.com/user/repos",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    return repos
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return
  }
}

export const fetchGitLabProjects = async () => {
  const accessToken = localStorage.getItem("gitlab_oauth_provider_token")

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  const user = await api.get("https://gitlab.com/api/v4/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!user) {
    console.error("No user found")
    return
  }

  const projects = await api.get(
    `https://gitlab.com/api/v4/users/${user.id}/projects`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const groups = await api.get("https://gitlab.com/api/v4/groups", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const groupProjects = await Promise.all([
    ...groups.map((group: { id: number }) =>
      api.get(`https://gitlab.com/api/v4/groups/${group.id}/projects`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ),
  ])

  return [
    ...projects,
    ...groupProjects.reduce((acc: any[], val: any) => acc.concat(val), []),
  ]
}

export const fetchBitBucketWorkspaces = async () => {
  const accessToken = window.localStorage.getItem(
    "bitbucket_oauth_provider_token",
  )

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  const workspaces = await api.get(
    "https://api.bitbucket.org/2.0/user/permissions/workspaces",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return workspaces
}

export const fetchBitBucketReposFromWorkspace = async (workspace: string) => {
  const accessToken = window.localStorage.getItem(
    "bitbucket_oauth_provider_token",
  )

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  const repos = await api.get(
    `https://api.bitbucket.org/2.0/repositories/${workspace}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return repos
}

export const getGitHubRepoOwner = async (repo: string) => {
  const accessToken = window.localStorage.getItem("github_oauth_provider_token")
  console.log("accessToken", accessToken)
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  try {
    const repoData = await api.get(`https://api.github.com/repos/${repo}`, {
      headers,
    })
    return repoData.owner.login
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error(`Repository not found or no access: ${repo}`)
      return null
    }
    throw error
  }
}

export const getGitLabRepoOwner = async (projectId: string) => {
  const accessToken = window.localStorage.getItem("gitlab_oauth_provider_token")
  const headers: Record<string, string> = {}

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  try {
    const projectData = await api.get(
      `https://gitlab.com/api/v4/projects/${projectId}`,
      {
        headers,
      },
    )
    return projectData.owner.username
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error(`Project not found or no access: ${projectId}`)
      return null
    }
    throw error
  }
}

export const getBitBucketRepoOwner = async (
  workspace: string,
  repo: string,
) => {
  const accessToken = window.localStorage.getItem(
    "bitbucket_oauth_provider_token",
  )
  const headers: Record<string, string> = {}

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  try {
    const repoData = await api.get(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo}`,
      {
        headers,
      },
    )
    return repoData.owner.username
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error(`Repository not found or no access: ${repo}`)
      return null
    }
    throw error
  }
}
