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
        redirectTo: `${import.meta.env.PUBLIC_BASE_URL}/auth/callback`,
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
  const { data } = await supabaseClient.auth.getSession()
  const accessToken = data?.session?.provider_token

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
  const { data } = await supabaseClient.auth.getSession()
  const accessToken = data?.session?.provider_token

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  const projects = await api.get("https://gitlab.com/api/v4/projects", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return projects
}

export const fetchGitLabReposFromProject = async (projectId: number) => {
  const { data } = await supabaseClient.auth.getSession()
  const accessToken = data?.session?.provider_token

  if (!accessToken) {
    console.error("No access token found")
    return
  }

  const repos = await api.get(
    `https://gitlab.com/api/v4/projects/${projectId}/repository/tree`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return repos
}

export const fetchBitBucketWorkspaces = async () => {
  const { data } = await supabaseClient.auth.getSession()
  const accessToken = data?.session?.provider_token

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
  const { data } = await supabaseClient.auth.getSession()
  const accessToken = data?.session?.provider_token

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
