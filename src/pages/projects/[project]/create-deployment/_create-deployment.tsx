import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function CreateDeploymentComponent() {
  const [deploymentName, setDeploymentName] = useState("")
  const [directory, setDirectory] = useState("")
  const [framework, setFramework] = useState("")
  const [buildCommand, setBuildCommand] = useState("")
  const [outputDirectory, setOutputDirectory] = useState("")
  const [installCommand, setInstallCommand] = useState("")
  const [devCommand, setDevCommand] = useState("")
  const [environmentVariables, setEnvironmentVariables] = useState("")
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      deploymentName,
      directory,
      framework,
      buildCommand,
      outputDirectory,
      installCommand,
      devCommand,
      environmentVariables,
      autoDeployEnabled,
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Create New Deployment</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="deploymentName">Deployment Name</Label>
          <Input
            id="deploymentName"
            placeholder="my-cloud-function"
            value={deploymentName}
            onChange={e => setDeploymentName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="directory">Directory</Label>
          <Input
            id="directory"
            placeholder="/"
            value={directory}
            onChange={e => setDirectory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="framework">Framework Preset</Label>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildCommand">Build Command</Label>
          <Input
            id="buildCommand"
            placeholder="npm run build"
            value={buildCommand}
            onChange={e => setBuildCommand(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="outputDirectory">Output Directory</Label>
          <Input
            id="outputDirectory"
            placeholder=".output"
            value={outputDirectory}
            onChange={e => setOutputDirectory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="installCommand">Install Command</Label>
          <Input
            id="installCommand"
            placeholder="npm install"
            value={installCommand}
            onChange={e => setInstallCommand(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="devCommand">Development Command</Label>
          <Input
            id="devCommand"
            placeholder="npm run dev"
            value={devCommand}
            onChange={e => setDevCommand(e.target.value)}
          />
        </div>
        <EnvironmentVariablesTable />
        <div className="flex items-center space-x-2">
          <Switch
            id="autoDeployEnabled"
            checked={autoDeployEnabled}
            onCheckedChange={setAutoDeployEnabled}
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
