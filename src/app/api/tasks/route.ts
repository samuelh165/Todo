import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { parseMessageToTask } from "@/lib/openai"

// GET - Fetch all tasks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filter = searchParams.get("filter") // all, today, upcoming, flagged
  
  const supabase = createServerClient()

  try {
    let query = (supabase
      .from("tasks") as any)
      .select(`
        *,
        users (
          id,
          phone_number,
          name
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (filter === "flagged") {
      query = query.eq("is_flagged", true)
    } else if (filter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      query = query
        .gte("due_date", today.toISOString())
        .lt("due_date", tomorrow.toISOString())
    } else if (filter === "upcoming") {
      const tomorrow = new Date()
      tomorrow.setHours(0, 0, 0, 0)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      query = query.gte("due_date", tomorrow.toISOString())
    }

    const { data: tasks, error } = await query

    if (error) {
      console.error("Error fetching tasks:", error)
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  try {
    const body = await request.json()
    const { content, user_id } = body

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "Content and user_id are required" },
        { status: 400 }
      )
    }

    // Parse the content with AI
    const parsedTask = await parseMessageToTask(content)

    // Create task
    const { data: task, error } = await (supabase
      .from("tasks") as any)
      .insert({
        user_id,
        title: parsedTask.title,
        content: parsedTask.content,
        summary: parsedTask.summary,
        due_date: parsedTask.due_date,
        priority: parsedTask.priority,
        category: parsedTask.category,
        status: "pending",
      })
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
      console.error("Error creating task:", error)
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 }
      )
    }

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

