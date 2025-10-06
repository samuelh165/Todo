import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// PATCH - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient()
  const { id } = await params

  try {
    const body = await request.json()
    const updates = body

    // Update task
    const { data: task, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        users (
          id,
          phone_number,
          name
        )
      `)
      .single()

    if (error) {
      console.error("Error updating task:", error)
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient()
  const { id } = await params

  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

