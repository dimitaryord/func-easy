import type React from "react"
import { Button } from "../ui/button"
import { signInWithGitProviders } from "@/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ConnectWithGitButton({
  provider,
  name,
  image,
  color,
}: {
  provider: "github" | "gitlab" | "bitbucket"
  name: string
  image?: string
  color?: string
}) {
  const connectWithGit = async (event: React.MouseEvent) => {
    event.preventDefault()
    await signInWithGitProviders(provider)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div
          className={`w-16 h-16 rounded-full text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <div
            className={cn(
              "size-16 bg-n20 rounded-full flex items-center justify-center",
              color,
            )}
          >
            {image ? (
              <img src={image} alt={name} className="w-14 h-14" />
            ) : null}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">{name}</h3>
        <p className="text-sm text-center text-muted-foreground">
          Connect with {name} to sync your repositories and collaborate
          seamlessly.
        </p>
        <Button
          onClick={connectWithGit}
          className="mt-4 text-center w-full"
          variant="link"
        >
          <span className="text-sm font-medium text-primary group-hover:underline">
            Connect Now
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}
