"use client"

import { useEffect, useState } from "react"
import { Task, User } from "@/types/database"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Flag, Sparkles, X } from "lucide-react"

type TaskWithUser = Task & { users?: User }

export default function ActionsPage() {
  const [tasks, setTasks] = useState<TaskWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const fetchFlaggedTasks = async () => {
    try {
      const response = await fetch("/api/tasks?filter=flagged")
      const data = await response.json()
      
      if (response.ok) {
        setTasks(data.tasks || [])
      } else {
        toast.error("Failed to fetch flagged tasks")
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch flagged tasks")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFlaggedTasks()
  }, [])

  const handleCategorise = async (taskId: string) => {
    setProcessingIds((prev) => new Set(prev).add(taskId))
    
    try {
      const response = await fetch("/api/categorise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Remove from flagged list
        setTasks(tasks.filter((t) => t.id !== taskId))
        toast.success(`Task categorized as "${data.task.category}"!`)
      } else {
        toast.error("Failed to categorize task")
      }
    } catch (error) {
      console.error("Error categorizing task:", error)
      toast.error("Failed to categorize task")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const handleIgnore = async (taskId: string) => {
    setProcessingIds((prev) => new Set(prev).add(taskId))
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_flagged: false }),
      })

      if (response.ok) {
        // Remove from flagged list
        setTasks(tasks.filter((t) => t.id !== taskId))
        toast.success("Task unflagged!")
      } else {
        toast.error("Failed to unflag task")
      }
    } catch (error) {
      console.error("Error unflagging task:", error)
      toast.error("Failed to unflag task")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Flag className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold">Actions Required</h1>
            </div>
            <p className="text-muted-foreground">
              Review and categorize flagged tasks
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading flagged tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>All caught up! 🎉</CardTitle>
                <CardDescription>
                  No flagged tasks require your attention right now.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const isProcessing = processingIds.has(task.id)
                
                return (
                  <Card key={task.id} className="overflow-hidden">
                    <CardHeader className="bg-red-50 dark:bg-red-950/20 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {task.content}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="destructive" className="gap-1">
                              <Flag className="h-3 w-3" />
                              Flagged
                            </Badge>
                            {task.users?.phone_number && (
                              <Badge variant="outline">
                                📱 {task.users.phone_number.slice(-10)}
                              </Badge>
                            )}
                            {task.priority && (
                              <Badge variant="secondary">
                                {task.priority} priority
                              </Badge>
                            )}
                            {task.category && (
                              <Badge variant="outline">
                                {task.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleCategorise(task.id)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isProcessing ? "Processing..." : "Categorise"}
                        </Button>
                        <Button
                          onClick={() => handleIgnore(task.id)}
                          disabled={isProcessing}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Ignore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

