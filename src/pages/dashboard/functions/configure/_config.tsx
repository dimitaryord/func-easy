import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, TrashIcon, SaveIcon, UploadIcon } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

// Mock function to simulate fetching function details
const fetchFunctionDetails = async (id: string) => {
  // In a real application, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  return {
    id,
    name: `Function ${id}`,
    env: {
      API_KEY: 'your-api-key',
      DEBUG: 'true',
      MAX_RETRIES: '3'
    }
  }
}

export default function FunctionEnvConfig() {
  const { id } = useParams<{ id: string }>()
  const [functionDetails, setFunctionDetails] = useState<{ id: string, name: string, env: Record<string, string> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [saveButtonText, setSaveButtonText] = useState('Save Changes')

  useEffect(() => {
    const loadFunctionDetails = async () => {
      try {
        const details = await fetchFunctionDetails(id!)
        setFunctionDetails(details)
        setEnvVars(details.env)
        setLoading(false)
      } catch (err) {
        setError('Failed to load function details')
        setLoading(false)
      }
    }

    loadFunctionDetails()
  }, [id])

  const handleAddEnvVar = () => {
    if (newKey && newValue) {
      setEnvVars(prev => ({ ...prev, [newKey]: newValue }))
      setNewKey('')
      setNewValue('')
      setSaveButtonText('Save Changes') // Reset save button text when a new value is added
    }
  }

  const handleRemoveEnvVar = (key: string) => {
    setEnvVars(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const handleSaveChanges = () => {
    // In a real application, this would be an API call to save the changes
    console.log('Saving environment variables:', envVars)
    toast({
      title: "Changes Saved",
      description: "Your environment variables have been updated.",
    })
    setSaveButtonText('All Changes Saved')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsedEnv = content.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=')
            if (key && value) {
              acc[key.trim()] = value.trim()
            }
            return acc
          }, {} as Record<string, string>)
          setEnvVars(prev => ({ ...prev, ...parsedEnv }))
          toast({
            title: "File Uploaded",
            description: "Environment variables have been imported from the file.",
          })
          setSaveButtonText('Save Changes') // Reset save button text when a new value is added
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse the uploaded file.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!functionDetails) {
    return <div className="flex justify-center items-center h-screen">Function not found</div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>Manage environment variables for {functionDetails.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(envVars).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveEnvVar(key)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-y-4">
            <div className="flex items-end space-x-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="key">Key</Label>
                <Input
                  type="text"
                  id="key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter key"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="value">Value</Label>
                <Input
                  type="text"
                  id="value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
              <Button onClick={handleAddEnvVar}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <UploadIcon className="h-5 w-5" />
                  <span>Upload .env file</span>
                </div>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".env"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {saveButtonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}