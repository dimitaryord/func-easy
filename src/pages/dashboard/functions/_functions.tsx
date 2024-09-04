import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, Code2Icon, SaveIcon, UploadIcon, TrashIcon, SettingsIcon } from 'lucide-react'

// Note: In a real-world scenario, you'd want to use a proper code editor like Monaco Editor or CodeMirror
// For this example, we'll use a simple textarea for simplicity
const CodeEditor = ({ code, onChange }: { code: string, onChange: (value: string) => void }) => (
    <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[400px] font-mono text-sm p-4 bg-gray-100 rounded-md"
    />
)

export function Functions() {
    type EnvVariables = {
        [key: string]: string;
    };
    type FunctionType = {
        id: number;
        name: string;
        status: string;
        url: string;
        code: string;
        env: EnvVariables;
    };

    const [functions, setFunctions] = useState<FunctionType[]>([
        {
            id: 1,
            name: 'User Authentication',
            status: 'Active',
            url: 'https://api.example.com/auth',
            code: `
export default function authenticate(req, res) {
  // Authentication logic here
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.status(200).json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}`,
            env: {
                JWT_SECRET: 'your-secret-key',
                DB_CONNECTION: 'mongodb://localhost:27017/auth'
            }
        },
        {
            id: 2,
            name: 'Data Processing',
            status: 'Inactive',
            url: 'https://api.example.com/process',
            code: `
export default function processData(req, res) {
  // Data processing logic here
  const { data } = req.body;
  const processed = data.map(item => item.toUpperCase());
  res.status(200).json({ result: processed });
}`,
            env: {
                API_KEY: 'your-api-key',
                MAX_PROCESSING_LIMIT: '1000'
            }
        },
        {
            id: 3,
            name: 'Notification Service',
            status: 'Active',
            url: 'https://api.example.com/notify',
            code: `
export default function sendNotification(req, res) {
  // Notification logic here
  const { message, recipients } = req.body;
  // Simulate sending notifications
  const sent = recipients.map(recipient => ({ to: recipient, status: 'sent' }));
  res.status(200).json({ notifications: sent });
}`,
            env: {
                SMTP_SERVER: 'smtp.example.com',
                SMTP_PORT: '587',
                SMTP_USER: 'your-username',
                SMTP_PASS: 'your-password'
            }
        },
    ])

    const [selectedFunction, setSelectedFunction] = useState<FunctionType | null>(null);
    const [editedCode, setEditedCode] = useState<string>('');
    const [editedEnv, setEditedEnv] = useState<EnvVariables>({});

    const handleEditCode = (func: FunctionType) => {
        setSelectedFunction(func)
        setEditedCode(func.code)
        setEditedEnv(func.env)
    }

    const handleSaveCode = () => {
        if (selectedFunction) {
            setFunctions(functions.map(f =>
                f.id === selectedFunction.id ? { ...f, code: editedCode, env: editedEnv } : f
            ))
            setSelectedFunction(null)
            alert('Code changes saved successfully!')
        }
    }

    const handleSaveEnv = () => {
        if (selectedFunction) {
            setFunctions(functions.map(f =>
                f.id === selectedFunction.id ? { ...f, env: editedEnv } : f
            ))
            setSelectedFunction(null)
            alert('Environment variables saved successfully!')
        }
    }

    const handleEnvChange = (key: string, value: string) => {
        setEditedEnv(prev => ({ ...prev, [key]: value }))
    }

    const handleAddEnv = () => {
        setEditedEnv(prev => ({ ...prev, '': '' }))
    }

    const handleRemoveEnv = (key: string) => {
        setEditedEnv(prev => {
            const newEnv = { ...prev }
            delete newEnv[key]
            return newEnv
        })
    }

    const handleEnvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    const parsedEnv = content.split('\n').reduce((acc: { [key: string]: string }, line: string) => {
                        const [key, value] = line.split('=')
                        if (key && value) {
                            acc[key.trim()] = value.trim()
                        }
                        return acc
                    }, {})
                    setEditedEnv(parsedEnv)
                } catch (error) {
                    console.error('Error parsing env file:', error)
                    // Here you would typically show an error message to the user
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Functions</h2>
                <Button>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Function
                </Button>
            </div>
            <Input className="w-full mb-4" type="search" placeholder="Search functions..." />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='text-white'>
                    {functions.map((func) => (
                        <TableRow key={func.id}>
                            <TableCell>{func.name}</TableCell>
                            <TableCell>{func.status}</TableCell>
                            <TableCell>{func.url}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditCode(func)}>
                                            <Code2Icon className="w-4 h-4 mr-2" />
                                            View Code
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl bg-white">
                                        <DialogHeader>
                                            <DialogTitle>{func.name}</DialogTitle>
                                        </DialogHeader>
                                        <Tabs defaultValue="view" className="w-full">
                                            <TabsList>
                                                <TabsTrigger value="view">View</TabsTrigger>
                                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                                <TabsTrigger value="config">Config</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="view">
                                                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                                                    <code>{func.code}</code>
                                                </pre>
                                            </TabsContent>
                                            <TabsContent value="edit">
                                                <CodeEditor
                                                    code={editedCode}
                                                    onChange={(newCode: string) => {
                                                        setEditedCode(newCode)
                                                    }}
                                                />
                                                <Button className="mt-4" onClick={handleSaveCode}>
                                                    <SaveIcon className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </TabsContent>
                                            <TabsContent value="config" className="h-[calc(100%-40px)] overflow-y-auto">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium">Environment Variables</h3>
                                                        <p className="text-sm text-gray-500">Manage your function's environment variables</p>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="env-file" className="cursor-pointer">
                                                            <div className="flex items-center space-x-2">
                                                                <UploadIcon className="w-5 h-5" />
                                                                <span>Upload .env file</span>
                                                            </div>
                                                        </Label>
                                                        <Input
                                                            id="env-file"
                                                            type="file"
                                                            className="hidden"
                                                            accept=".env"
                                                            onChange={handleEnvFileUpload}
                                                        />
                                                    </div>
                                                    {Object.entries(editedEnv).map(([key, value]) => (
                                                        <div key={key} className="flex items-center space-x-2">
                                                            <Input
                                                                value={key}
                                                                onChange={(e) => {
                                                                    const newKey = e.target.value
                                                                    handleEnvChange(newKey, editedEnv[key])
                                                                    if (key !== newKey) {
                                                                        handleRemoveEnv(key)
                                                                    }
                                                                }}
                                                                placeholder="KEY"
                                                                className="w-1/3"
                                                            />
                                                            <Input
                                                                value={value}
                                                                onChange={(e) => handleEnvChange(key, e.target.value)}
                                                                placeholder="VALUE"
                                                                className="w-1/2"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveEnv(key)}
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button onClick={handleAddEnv}>
                                                        <PlusIcon className="w-4 h-4 mr-2" />
                                                        Add Environment Variable
                                                    </Button>
                                                    <Button className="mt-4" onClick={handleSaveEnv}>
                                                        <SaveIcon className="w-4 h-4 mr-2" />
                                                        Save Environment Variables
                                                    </Button>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditCode(func)}>
                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                    Config Envs
                                </Button>
                                <Button variant="outline" size="sm">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}