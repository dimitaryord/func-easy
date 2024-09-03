import { supabaseClient } from "@/supabase/client"
import { useEffect } from "react"

export function CallbackComponent() {
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      const urlParams = new URLSearchParams(window.location.search)
      const provider = urlParams.get("provider")
      if (provider) {
        window.localStorage.setItem("auth_provider", provider)
      }

      if (session && session.provider_token) {
        window.localStorage.setItem(
          `${provider}_oauth_provider_token`,
          session.provider_token,
        )
      }

      if (session && session.provider_refresh_token) {
        window.localStorage.setItem(
          `${provider}_oauth_provider_refresh_token`,
          session.provider_refresh_token,
        )
      }

      if (event === "SIGNED_OUT") {
        const provider = window.localStorage.getItem("auth_provider")
        window.localStorage.removeItem(`${provider}_oauth_provider_token`)
        window.localStorage.removeItem(
          `${provider}_oauth_provider_refresh_token`,
        )
        window.localStorage.removeItem("auth_provider")
      }

      window.location.href = "/projects"
    })
  })

  return <></>
}
