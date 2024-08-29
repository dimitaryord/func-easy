"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GitForkIcon,
  StarIcon,
  CheckCircle2Icon,
  GithubIcon,
  GitlabIcon,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for repositories from different providers
const mockRepos = {
  github: [
    {
      id: "gh1",
      name: "react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      stars: 194000,
      forks: 40000,
    },
    {
      id: "gh2",
      name: "vue",
      description:
        "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
      stars: 200000,
      forks: 32000,
    },
    {
      id: "gh3",
      name: "angular",
      description: "One framework. Mobile & desktop.",
      stars: 85000,
      forks: 22000,
    },
  ],
  gitlab: [
    {
      id: "gl1",
      name: "gitlab-ce",
      description: "GitLab Community Edition",
      stars: 22800,
      forks: 5600,
    },
    {
      id: "gl2",
      name: "gitlab-runner",
      description: "GitLab Runner",
      stars: 3200,
      forks: 1800,
    },
    {
      id: "gl3",
      name: "gitaly",
      description:
        "Gitaly is a Git RPC service for handling all the git calls made by GitLab",
      stars: 420,
      forks: 220,
    },
  ],
  bitbucket: [
    {
      id: "bb1",
      name: "python-repo",
      description: "A sample Python repository",
      stars: 150,
      forks: 30,
    },
    {
      id: "bb2",
      name: "java-project",
      description:
        "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web",
      stars: 80,
      forks: 15,
    },
    {
      id: "bb3",
      name: "react-app",
      description: "A React application template",
      stars: 200,
      forks: 45,
    },
    {
      id: "bb4",
      name: "react-app",
      description: "A React application template",
      stars: 200,
      forks: 45,
    },
    {
      id: "bb5",
      name: "react-app",
      description: "A React application template",
      stars: 200,
      forks: 45,
    },
  ],
}

interface Repo {
  id: string
  name: string
  description: string
  stars: number
  forks: number
}

type Provider = keyof typeof mockRepos

export default function RepoChooser() {
  const [provider, setProvider] = useState<Provider>("github")
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider as Provider)
    setSelectedRepo(null)
  }

  const handleRepoSelect = (repo: Repo) => {
    setSelectedRepo(repo)
  }

  const handleContinue = () => {
    if (selectedRepo) {
      console.log(
        `Continuing with ${provider} repository: ${selectedRepo.name}`,
      )
      // Here you would typically navigate to the next step or perform some action
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
              onClick={() => handleProviderChange(p)}
            >
              {p === "github" && <GithubIcon className="mr-2 h-4 w-4" />}
              {p === "gitlab" && <GitlabIcon className="mr-2 h-4 w-4" />}
              {p === "bitbucket" && <span className="mr-2">B</span>}
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[500px] w-full px-5 mb-8">
        {mockRepos[provider].map((repo: Repo) => (
          <Card
            key={repo.id}
            className={`w-[80svw] xl:w-[40svw] cursor-pointer transition-all hover:shadow-md mb-4 mt-2 mx-2 text-white ${selectedRepo?.id === repo.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleRepoSelect(repo)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{repo.name}</span>
                {selectedRepo?.id === repo.id && (
                  <CheckCircle2Icon className="text-primary" />
                )}
              </CardTitle>
              <CardDescription>{repo.description}</CardDescription>
              <div className="flex items-center mt-2 text-sm">
                <StarIcon className="w-4 h-4 mr-1" />
                <span className="mr-4">{repo.stars.toLocaleString()}</span>
                <GitForkIcon className="w-4 h-4 mr-1" />
                <span>{repo.forks.toLocaleString()}</span>
              </div>
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
