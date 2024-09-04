import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2, Rocket, FileText } from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const initialCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`

export default function SimpleCodeEditor() {
    const [functionName] = useState('greet')
    const [code, setCode] = useState(initialCode)
    const [language] = useState('javascript')
    const [isDeploying, setIsDeploying] = useState(false)
    const [isDeployed, setIsDeployed] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value)
        }
    }

    const handleDeploy = async () => {
        setIsDeploying(true)
        // Simulating an API call to deploy the changes
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsDeploying(false)
        setIsDeployed(true)
        setShowConfirmDialog(false)
        toast({
            title: "Function Deployed",
            description: `Successfully deployed ${functionName}`,
        })
    }

    const handleViewLogs = () => {
        toast({
            title: "Viewing Logs",
            description: `Opening logs for ${functionName}`,
        })
        // Here you would typically open a new window or navigate to a logs page
        console.log(`Viewing logs for ${functionName}`)
    }

    return (
        <div className="flex flex-col h-screen bg-background p-4 text-white">
            <div className="mb-4 space-y-2">

                <div className="text-white border border-gray-500 p-2 rounded-md">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                            <span className="font-semibold">Function Name:</span>
                            <span className="ml-2">{functionName}</span>
                        </div>
                        <hr className="my-2 border-gray-600" />
                        <div className="flex items-center">
                            <span className="font-semibold">Language:</span>
                            <span className="ml-2">{language}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <Tabs defaultValue="editor" className="h-full">
                    <TabsList>
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="h-[calc(100%-2rem)]">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                            }}
                            className="text-white"
                        />
                    </TabsContent>
                    <TabsContent value="preview" className="h-[calc(100%-2rem)]">
                        <pre className="bg-muted p-4 rounded-md overflow-auto h-full text-white">
                            <code>{code}</code>
                        </pre>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="mt-4 flex space-x-2">
                <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isDeploying}
                    className="bg-primary text-white hover:bg-primary/90"
                >
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy Function
                </Button>
                {isDeployed && (
                    <Button
                        onClick={handleViewLogs}
                        className="bg-secondary text-white hover:bg-secondary/90"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        View Logs
                    </Button>
                )}
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Are you sure you want to deploy?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white">
                            This will deploy the function "{functionName}" with the current code.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeploy} disabled={isDeploying} className="text-white">
                            {isDeploying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                    Deploying...
                                </>
                            ) : (
                                'Deploy'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}