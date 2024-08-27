import { createClient } from "@supabase/supabase-js"
import constants from "@/constants"

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
