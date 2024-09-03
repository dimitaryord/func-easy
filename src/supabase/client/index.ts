import api from "@/utils/api"
import { createClient } from "@supabase/supabase-js"
import type { Repository } from "@/schemas/github"

export const supabaseClient = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
)

export async function signInWithGitProviders(
  provider: "github" | "gitlab" | "bitbucket",
) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${import.meta.env.PUBLIC_BASE_URL}/auth/callback?provider=${provider}`,
        scopes: "api read_user read_repository read_api",
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

  const repos = await api.get<Repository[]>(
    "https://api.github.com/user/repos",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return repos
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
