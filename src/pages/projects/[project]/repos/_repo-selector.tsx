import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Repository } from "@/schemas/github"
import {
  fetchGitHubRepos,
  fetchGitLabProjects,
  fetchBitBucketWorkspaces,
  fetchBitBucketReposFromWorkspace,
} from "@/supabase/client"
import { supabaseClient } from "@/supabase/client"

type Provider = "github" | "gitlab" | "bitbucket" | null

export default function RepoChooser({ project }: { project?: string }) {
  const [provider, setProvider] = useState<Provider>(null)
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [repos, setRepos] = useState<Repository[] | undefined>([])

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider)
    setSelectedRepo(null)
    setRepos([])
    window.localStorage.setItem("auth_provider", newProvider || "github")
  }

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo)
  }

  useEffect(() => {
    const provider = window.localStorage.getItem("auth_provider") as Provider
    setProvider(provider)
  }, [])

  useEffect(() => {
    async function setup() {
      if (!provider) {
        return
      }

      if (provider === "github") {
        const repos = await fetchGitHubRepos()
        setRepos(repos || [])
      } else if (provider === "gitlab") {
        const projects = await fetchGitLabProjects()
        setRepos(projects || [])
      } else if (provider === "bitbucket") {
        const workspaces = await fetchBitBucketWorkspaces()
        const data = await Promise.all([
          ...workspaces.values.map(
            (workspace: { workspace: { name: string } }) =>
              fetchBitBucketReposFromWorkspace(workspace.workspace.name),
          ),
        ])
        setRepos(
          data.reduce((acc, val) => {
            return acc.concat(
              val.values.map((repo: any) => {
                repo.id = repo.uuid.replaceAll(/{|}/g, "")
                return repo
              }),
            )
          }, []),
        )
      }
    }

    setup()
  }, [provider])

  const handleContinue = async () => {
    if (selectedRepo) {
      await supabaseClient
        .from("projects")
        .update({ repo: selectedRepo.name, provider: provider })
        .eq("name", project)

      window.location.href = `/projects/${project}/create-deployment?repo=${provider === "gitlab" ? selectedRepo.id : selectedRepo.full_name}`
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Select a Repository
      </h1>

      {/* Provider Selection */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {["github", "gitlab", "bitbucket"].map(p => (
            <Button
              key={p}
              variant={provider === p ? "default" : "outline"}
              className={`${p === "github" ? "rounded-l-md" : ""} ${
                p === "bitbucket" ? "rounded-r-md" : ""
              } ${provider === p ? "text-white" : "hover:text-primary hover:bg-primary/10"}`}
              onClick={() => handleProviderChange(p as Provider)}
            >
              {p === "github" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 512 512"
                  className="size-8 mr-2"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="white"
                    d="M192 368.004c0-8.844 7.156-16 16-16s16 7.156 16 16-7.156 16-16 16-16-7.156-16-16zM349.328 494.16c-4.266 1.219-8.672 2.094-13.328 2.094-26.516 0-48-21.484-48-48v-58.188c0-20.094 12.898-37.156 30.797-43.438C353.164 335.082 384 306.082 384 272.004V240c0-15.164-6.188-29.285-16-41.367V162.5c0-17.668-14.328-23.719-32-13.496l-24.516 14.176C303.633 161.145 295.703 160 288 160h-64c-7.699 0-15.633 1.145-23.484 3.18L176 149.004c-17.668-10.223-32-4.172-32 13.496v36.133c-9.812 12.082-16 26.203-16 41.367v32.004c0 23.281 14.488 44.188 34.578 58.812l-.02.031c4.172 2.859 6.945 7.688 6.945 13.156 0 8.828-7.176 16-16 16-4.52 0-8.574-1.891-11.48-4.906C115.004 334.629 96 305.035 96 272.004V240c0-18.523 6.012-35.977 16-51.375v-47.633c0-35.336 28.645-47.438 64-26.996l27.461 15.887C210.309 128.719 217.172 128 224 128h64c6.828 0 13.688.719 20.539 1.883L336 113.996c35.359-20.441 64-8.34 64 26.996v47.633c9.984 15.398 16 32.852 16 51.375v32.004c0 47.609-39.25 88.141-85.531 104.359-.055.047-.109.172-.188.188-6.016 2.312-10.281 8.125-10.281 14.953v56.75c0 8.844 7.156 16 16 16 1.336 0 2.562-.375 3.797-.688C421.969 430.41 480 350.066 480 256c0-123.715-100.281-224-224-224C132.285 32 32 132.285 32 256c0 97.41 62.254 180.066 149.121 210.895.445.047.852.234 1.316.234 5.277 0 9.562-4.297 9.562-9.562 0-5.281-4.285-9.562-9.562-9.562-.113 0-.113-.094-.191-.141-53.16-1.422-53.219-63.859-70.246-63.859-8.844 0-16-7.156-16-16s7.156-16 16-16h7.988c32.02 0 27.445 64 72.012 64 17.668 0 32 14.328 32 32v28c0 15.453-12.527 28-28.004 28-1.688 0-3.277-.344-4.887-.656C81.203 474.613 0 374.926 0 256 0 114.617 114.617 0 256 0s256 114.617 256 256c0 108.41-67.492 200.848-162.672 238.16z"
                  ></path>
                </svg>
              )}
              {p === "gitlab" && (
                <img
                  src="https://images.ctfassets.net/xz1dnu24egyd/3JZABhkTjUT76LCIclV7sH/17a92be9bce78c2adcc43e23aabb7ca1/gitlab-logo-500.svg"
                  className="mr-2 size-8"
                />
              )}
              {p === "bitbucket" && (
                <img src="/bitbucket-logo.svg" className="mr-2 size-8" />
              )}
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[500px] w-full px-5 mb-8">
        {repos?.map((repo: Repository) => (
          <Card
            key={repo.id}
            className={`w-[80svw] xl:w-[40svw] cursor-pointer transition-all hover:shadow-md mb-4 mt-2 mx-2 text-white ${selectedRepo?.id === repo.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleRepoSelect(repo)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{repo.full_name || repo.name}</span>
              </CardTitle>
              <CardDescription>{repo.description}</CardDescription>
              <div className="flex items-center mt-2 text-sm"></div>
            </CardHeader>
          </Card>
        ))}
      </ScrollArea>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="w-full md:w-auto text-white"
          disabled={!selectedRepo}
          onClick={handleContinue}
        >
          Continue with{" "}
          {selectedRepo ? selectedRepo.name : "selected repository"}
        </Button>
      </div>
    </div>
  )
}
