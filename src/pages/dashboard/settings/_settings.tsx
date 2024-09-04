import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOutIcon, UserIcon } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function Settings() {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/placeholder.svg?height=32&width=32',
        plan: 'Free'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const handleUpgradePlan = () => {
        // Logic to handle plan upgrade
        alert('Upgrade plan functionality to be implemented')
    }

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                                <Input name="name" value={user.name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                                <Input name="email" value={user.email} onChange={handleInputChange} />
                            </div>
                            <div className="flex justify-left items-center space-x-4">
                                <div className="text-center">
                                    <div>
                                        <label className="block text-xl font-medium text-muted-foreground">Plan</label>
                                    </div>
                                    <Badge variant="outline" className="text-sm text-blue-600 border-blue-600">{user.plan}</Badge>
                                </div>
                                <Button variant="secondary" className="bg-blue-600 text-white" onClick={handleUpgradePlan}>Upgrade</Button>
                            </div>
                            <Button variant="default" className="border">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}