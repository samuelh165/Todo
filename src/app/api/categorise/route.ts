import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  try {
    const body = await request.json()
    const { task_id } = body

    if (!task_id) {
      return NextResponse.json(
        { error: "task_id is required" },
        { status: 400 }
      )
    }

    // Fetch the task
    const { data: task, error: fetchError } = await (supabase
      .from("tasks") as any)
      .select("*")
      .eq("id", task_id)
      .single()

    if (fetchError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    // Use AI to categorize
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a task categorization assistant. Categorize the given task into ONE of these categories:
- Work
- Personal
- Shopping
- Health
- Finance
- Education
- Home
- Other

Respond with ONLY the category name, nothing else.`,
        },
        {
          role: "user",
          content: task.content,
        },
      ],
      temperature: 0.3,
    })

    const category = completion.choices[0]?.message?.content?.trim() || "Other"

    // Update task with category and unflag it
    const { data: updatedTask, error: updateError } = await (supabase
      .from("tasks") as any)
      .update({
        category,
        is_flagged: false,
      })
      .eq("id", task_id)
      .select(`
        *,
        users (
          id,
          phone_number,
          name
        )
      `)
      .single()

    if (updateError) {
      console.error("Error updating task:", updateError)
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

