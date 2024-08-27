import type React from "react"
import { Button } from "../ui/button"
import { signInWithGitProviders } from "@/supabase/client"

export function ConnectWithGitButton({
  provider,
  children,
}: {
  provider: "github" | "gitlab" | "bitbucket"
  children: React.ReactNode
}) {
  const connectWithGithub = async (event: React.MouseEvent) => {
    event.preventDefault()
    await signInWithGitProviders(provider)
  }

  return <Button onClick={connectWithGithub}>{children}</Button>
}
