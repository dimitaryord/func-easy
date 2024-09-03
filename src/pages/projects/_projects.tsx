import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TablesInsert } from "database.types"
import { createProject, getProjectsForUser } from "@/supabase/client/db"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, ArrowRight, Sparkles } from "lucide-react"

export default function Projects() {
  const [projects, setProjects] = useState<TablesInsert<"projects">[]>([])
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      const projects = await getProjectsForUser()
      if (projects) {
        setProjects(
          projects.map(project => ({
            name: project.name,
            description: project.description,
            repo: project.repo,
          })),
        )
      }
    }

    fetchProjects()
  }, [])

  const handleCreateProject = async () => {
    if (newProjectName.trim() !== "") {
      const newProject = {
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        repo: null,
      }
      await createProject(newProject)
      setProjects([...projects, newProject])
      setNewProjectName("")
      setNewProjectDescription("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-primary ">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Next Adventure
        <Sparkles className="inline-block ml-2 text-primary" />
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={`${project.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-background border-border">
                <div className="h-2 bg-secondary"></div>
                <CardHeader>
                  <CardTitle className="text-foreground/100">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-foreground/90">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <a href={project.repo ? "/dashboard" : `/projects/${project.name}/repos`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300">
                      Open Project
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="py-4 border-dashed cursor-pointer hover:bg-slate-700 transition-colors duration-300 h-full bg-slate-800 border-border">
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <PlusCircle className="h-12 w-12 text-primary mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    Create New Project
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 text-slate-100 border-slate-700">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="text-slate-300">
                Enter the details for your new project. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="col-span-3 bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newProjectDescription}
                  onChange={e => setNewProjectDescription(e.target.value)}
                  className="col-span-3 bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateProject}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
