import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CloudIcon, CodeIcon, LayoutDashboardIcon, LogOutIcon, PlusIcon, SettingsIcon, TrashIcon, UserIcon } from 'lucide-react'

export default function Dashboard() {
    const [selectedFunction, setSelectedFunction] = useState<{
        id: number
        name: string
        status: string
        url: string
    } | null>(null);

    const functions = [
        { id: 1, name: 'User Authentication', status: 'Active', url: 'https://api.example.com/auth' },
        { id: 2, name: 'Data Processing', status: 'Inactive', url: 'https://api.example.com/process' },
        { id: 3, name: 'Notification Service', status: 'Active', url: 'https://api.example.com/notify' },
    ]

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}


                {/* Function List */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-foreground">Your Functions</h2>
                        <Button>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            New Function
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {functions.map((func) => (
                            <Card key={func.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => setSelectedFunction(func)}>
                                <CardHeader>
                                    <CardTitle>{func.name}</CardTitle>
                                    <CardDescription>{func.url}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant={func.status === 'Active' ? 'default' : 'secondary'}>{func.status}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Function Details */}
                {selectedFunction && (
                    <div className="p-6 bg-card shadow-sm mt-6">
                        <h3 className="text-xl font-semibold text-foreground mb-4">{selectedFunction.name} Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge variant={selectedFunction.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                                    {selectedFunction.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-primary">URL:</p>
                                <p className="mt-2 text-secondary">{selectedFunction.url}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" className="mr-2 text-white" onClick={() => window.location.href = `dashboard/functions/editor?function=${selectedFunction.id}`}>
                                <CodeIcon className="w-4 h-4 mr-2" />
                                Edit Code
                            </Button>
                            <Button variant="outline" className="mr-2 text-white" onClick={(e) => window.location.href = `dashboard/functions/configure/`}>
                                <SettingsIcon className="w-4 h-4 mr-2" />
                                Configure
                            </Button>
                            <Button variant="outline" className="mr-2 text-white bg-red-500" onClick={() => window.location.href = `functions/${selectedFunction.id}/delete`}>
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}