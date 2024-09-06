import api from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getGitHubRepoOwner,
  getGitLabRepoOwner,
  getBitBucketRepoOwner,
  supabaseClient,
} from "@/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import EnvironmentVariablesTable from "@/components/react/environment-variables"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const deploymentSchema = z.object({
  deploymentName: z.string().min(1, "Deployment name is required"),
  directory: z.string().default("/"),
  branchName: z.string().default("main"),
  framework: z.string().optional(),
  environmentVariables: z
    .array(
      z.object({
        key: z.string().min(1, "Environment variable key is required"),
        value: z.string().min(1, "Environment variable value is required"),
        type: z.enum(["production", "preview"]).default("production"),
      }),
    )
    .optional(),
  autoDeployEnabled: z.boolean().default(true),
})

type DeploymentFormData = z.infer<typeof deploymentSchema>

export default function CreateDeploymentComponent({
  project,
}: {
  project: string
}) {
  const { register, handleSubmit, watch, setValue } =
    useForm<DeploymentFormData>({
      resolver: zodResolver(deploymentSchema),
      defaultValues: {
        deploymentName: "",
        directory: "/",
        branchName: "main",
        framework: "python",
        environmentVariables: [],
        autoDeployEnabled: true,
      },
    })

  const onSubmit = async (data: DeploymentFormData) => {
    console.log("Submitting deployment data:", data)

    const provider = localStorage.getItem("auth_provider")
    let owner = ""
    let token = ""

    const repo = new URLSearchParams(window.location.search).get("repo")

    if (!provider || !repo) {
      console.error("Provider or repo not found")
      return
    }

    switch (provider) {
      case "github":
        token = localStorage.getItem("github_oauth_provider_token") || ""
        owner = await getGitHubRepoOwner(repo)
        break
      case "gitlab":
        token = localStorage.getItem("gitlab_oauth_provider_token") || ""
        owner = await getGitLabRepoOwner(repo)
        break
      case "bitbucket":
        token = localStorage.getItem("bitbucket_oauth_provider_token") || ""
        const [workspace, repoName] = repo.split("/")
        owner = await getBitBucketRepoOwner(workspace, repoName)
        break
      default:
        console.error("Invalid provider")
        return
    }

    if (!owner || !token) {
      console.error("Owner or token not found")
      return
    }

    const requestBody = {
      owner: owner,
      repo: repo,
      provider: provider,
      branch: data.branchName,
      token: token,
      srcFunctionsPath: data.directory,
    }

    try {
      await api.post("/api/function-deploy", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const { data: projectData, error } = await supabaseClient
        .from("projects")
        .select()
        .eq("name", project)
        .eq("uid", (await supabaseClient.auth.getUser()).data.user?.id)
        .single()

      if (error) {
        console.error("Error fetching project data:", error)
        return
      }

      await supabaseClient.from("deployments").insert({
        name: data.deploymentName,
        status: "Active",
        project_id: projectData.id,
      })
    } catch (error) {
      console.error("Deployment failed:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Create New Deployment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="deploymentName">Deployment Name</Label>
          <Input
            id="deploymentName"
            placeholder="my-cloud-function"
            {...register("deploymentName")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory">Directory</Label>
          <Input id="directory" placeholder="/" {...register("directory")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            placeholder="main"
            {...register("branchName")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="framework">Framework Preset</Label>
          <Select
            value={watch("framework")}
            onValueChange={value => setValue("framework", value)}
          >
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <EnvironmentVariablesTable
          environmentVariables={watch("environmentVariables") || []}
          setEnvironmentVariables={value =>
            setValue("environmentVariables", value)
          }
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="autoDeployEnabled"
            checked={watch("autoDeployEnabled")}
            onCheckedChange={checked => setValue("autoDeployEnabled", checked)}
          />
          <Label htmlFor="autoDeployEnabled">Enable Auto Deployment</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Automatically deploy when changes are pushed to the repository
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button type="submit" className="w-full">
          Create Deployment
        </Button>
      </form>
    </div>
  )
}
