import { supabaseClient } from "@/supabase/client"
import { useEffect } from "react"

export function CallbackComponent() {
  useEffect(() => {
    async function handleAuthCallback() {
      const urlFragment = window.location.hash.substring(1)
      const params = new URLSearchParams(urlFragment)

      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (accessToken && refreshToken) {
        try {
          const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Error setting session:", error)
            return
          }

          window.location.href = "/"
        } catch (error) {
          console.error("Error during authentication:", error)
        }
      } else {
        console.error("Access token not found in the URL fragment")
      }
    }
    handleAuthCallback()
  })

  return <></>
}
