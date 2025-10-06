"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddTaskFormProps {
  onAdd: (content: string) => Promise<void>
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await onAdd(content)
      setContent("")
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="E.g., Buy groceries tomorrow, Call mom next week..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!content.trim() || isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

