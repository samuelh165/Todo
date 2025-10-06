"use client"

import { useEffect, useState } from "react"
import { Task, User } from "@/types/database"
import { NavBar } from "@/components/NavBar"
import { TaskCard } from "@/components/TaskCard"
import { AddTaskForm } from "@/components/AddTaskForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

type TaskWithUser = Task & { users?: User }

interface GroupedTasks {
  [phone: string]: TaskWithUser[]
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Hard-coded test user ID for dev mode
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000001"

  const fetchTasks = async (filter?: string) => {
    try {
      const url = filter && filter !== "all" 
        ? `/api/tasks?filter=${filter}` 
        : "/api/tasks"
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        setTasks(data.tasks || [])
      } else {
        toast.error("Failed to fetch tasks")
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks(activeTab)
  }, [activeTab])

  const handleAddTask = async (content: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, user_id: TEST_USER_ID }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks([data.task, ...tasks])
        toast.success("Task added successfully!")
      } else {
        toast.error("Failed to add task")
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task")
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)))
        toast.success("Task updated!")
      } else {
        toast.error("Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId))
        toast.success("Task deleted!")
      } else {
        toast.error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  // Group tasks by phone number
  const groupedTasks = tasks.reduce<GroupedTasks>((acc, task) => {
    const phone = task.users?.phone_number || "Unknown"
    if (!acc[phone]) {
      acc[phone] = []
    }
    acc[phone].push(task)
    return acc
  }, {})

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </div>

          {/* Add Task Form */}
          <div className="mb-8">
            <AddTaskForm onAdd={handleAddTask} />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No tasks found. Add your first task above!
                  </p>
                </div>
              ) : (
                Object.entries(groupedTasks).map(([phone, phoneTasks]) => (
                  <div key={phone} className="space-y-4">
                    <h2 className="text-lg font-semibold text-muted-foreground">
                      {phone === "Unknown" ? "Unknown User" : `📱 ${phone.slice(-10)}`}
                    </h2>
                    <div className="space-y-3">
                      {phoneTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                          showPhone={false}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

