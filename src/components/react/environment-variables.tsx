import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon, Plus, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type EnvironmentVariable = {
  key: string
  value: string
  type: "production" | "preview"
}

export default function EnvironmentVariablesTable({
  environmentVariables,
  setEnvironmentVariables,
}: {
  environmentVariables: EnvironmentVariable[]
  setEnvironmentVariables: (variables: EnvironmentVariable[]) => void
}) {
  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")
  const [envType, setEnvType] = useState<"production" | "preview">("production")

  const addEnvironmentVariable = () => {
    if (newEnvKey && newEnvValue) {
      setEnvironmentVariables([
        ...environmentVariables,
        { key: newEnvKey, value: newEnvValue, type: envType },
      ])
      setNewEnvKey("")
      setNewEnvValue("")
    }
  }

  const removeEnvironmentVariable = (index: number) => {
    setEnvironmentVariables(environmentVariables.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto bg-background">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Set environment variables for your deployment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="envType"
            checked={envType === "production"}
            onCheckedChange={checked =>
              setEnvType(checked ? "production" : "preview")
            }
          />
          <Label htmlFor="envType">
            {envType === "production" ? "Production" : "Preview"}
          </Label>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variable Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {environmentVariables
              .filter(env => env.type === envType)
              .map((env, index) => (
                <TableRow key={index}>
                  <TableCell>{env.key}</TableCell>
                  <TableCell>{env.value}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnvironmentVariable(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell>
                <Input
                  placeholder="KEY"
                  value={newEnvKey}
                  onChange={e => setNewEnvKey(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="VALUE"
                  value={newEnvValue}
                  onChange={e => setNewEnvValue(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addEnvironmentVariable}
                  disabled={!newEnvKey || !newEnvValue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
