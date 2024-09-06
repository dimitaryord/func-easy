import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/supabase/client"
import { useEffect, useState } from "react"

type Deployment = {
  id: number
  name: string
  status: "Active" | "Inactive"
  createdAt: number
}

export default function DashboardComponent() {
  const [deployments, setDeployments] = useState<Deployment[]>([])

  useEffect(() => {
    async function fetchDeployments() {
      const { data, error } = await supabaseClient
        .from("deployments")
        .select("*")
      if (error) {
        console.error(error)
      } else {
        setDeployments(data)
      }
    }
    fetchDeployments()
  }, [])
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{deployments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {deployments.filter(d => d.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Deployment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {deployments.length > 0 ? deployments[0].name : "No Deployments"}
            </p>
            <p className="text-sm text-muted-foreground">
              {deployments.length > 0
                ? new Date(deployments[0].createdAt).toLocaleDateString()
                : "---"}
            </p>
          </CardContent>
        </Card>
      </div>

      {deployments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Deployed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map(deployment => (
                  <TableRow key={deployment.id}>
                    <TableCell>{deployment.name}</TableCell>
                    <TableCell>{deployment.status}</TableCell>
                    <TableCell>
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  )
}
