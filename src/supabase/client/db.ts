import { supabaseClient } from "."
import type { TablesInsert } from "database.types"
import type { Repository } from "@/schemas/github"

type ProjectInsert = TablesInsert<"projects">



export async function createProject({
  name,
  description,
  repository,
}: {
  name: string
  description: string
  repository?: Repository
}) {
  const { error } = await supabaseClient
    .from("projects")
    .insert<ProjectInsert[]>([
      {
        name: name,
        description: description,
        repo: repository ? repository.url : null,
      },
    ])

  if (error) {
    console.error("Error creating project:", error)
    return
  }
}

export async function getProjectsForUser() {
  const { data, error } = await supabaseClient.from("projects").select("*")

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function updateProject({
  id,
  name,
  description,
  functions,
}: {
  id: string
  name?: string
  description?: string
  functions?: { name: string; info: string }[]
}) {
  const { error } = await supabaseClient
    .from("projects")
    .update({ name, description, functions })
    .eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    return
  }
}

