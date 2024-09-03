import { supabaseClient } from "."
import type { TablesInsert } from "database.types"

type ProjectInsert = TablesInsert<"projects">

export async function createProject({
  name,
  description,
}: {
  name: string
  description: string
}) {
  const { error } = await supabaseClient
    .from("projects")
    .insert<ProjectInsert[]>([
      {
        name: name,
        description: description,
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
