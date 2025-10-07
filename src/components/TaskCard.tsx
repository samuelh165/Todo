"use client"

import { useState } from "react"
import { Task, User } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Calendar, 
  Check, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Flag,
  Clock,
  Tag
} from "lucide-react"
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task & { users?: User }
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete?: (taskId: string) => Promise<void>
  showPhone?: boolean
}

export function TaskCard({ task, onUpdate, onDelete, showPhone }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(task.content)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!onUpdate) return
    setIsLoading(true)
    try {
      await onUpdate(task.id, { content: editedContent })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async () => {
    if (!onUpdate) return
    const newStatus = task.status === "completed" ? "pending" : "completed"
    await onUpdate(task.id, { status: newStatus })
  }

  const handleDelete = async () => {
    if (!onDelete) return
    await onDelete(task.id)
  }

  const handleToggleFlag = async () => {
    if (!onUpdate) return
    await onUpdate(task.id, { is_flagged: !task.is_flagged })
  }

  const handleChangeCategory = async (newCategory: string) => {
    if (!onUpdate) return
    await onUpdate(task.id, { category: newCategory })
  }

  const categories = ["work", "personal", "shopping", "health", "finance", "other"]

  const getDueLabel = (dueDate: string | null) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    
    if (isToday(date)) return { label: "Today", variant: "default" as const }
    if (isTomorrow(date)) return { label: "Tomorrow", variant: "secondary" as const }
    if (isPast(date)) return { label: "Overdue", variant: "destructive" as const }
    
    return { 
      label: format(date, "MMM d"), 
      variant: "outline" as const 
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const dueInfo = task.due_date ? getDueLabel(task.due_date) : null

  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-md",
        task.status === "completed" && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={cn(
              "mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
              task.status === "completed"
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-green-500"
            )}
          >
            {task.status === "completed" && (
              <Check className="h-3 w-3 text-white" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedContent(task.content)
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Title - if available */}
                {task.title && (
                  <h3
                    className={cn(
                      "text-base font-semibold mb-1",
                      task.status === "completed" && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </h3>
                )}
                
                {/* Summary or Content */}
                <p
                  className={cn(
                    "text-sm mb-2",
                    task.title ? "text-muted-foreground" : "font-medium",
                    task.status === "completed" && "line-through opacity-60"
                  )}
                >
                  {task.summary || task.content}
                </p>
                
                {/* Show full content in a collapsible way if we have both title and summary */}
                {task.title && task.summary && task.content !== task.summary && (
                  <details className="mb-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View original message
                    </summary>
                    <p className="text-xs text-muted-foreground mt-1 pl-2 border-l-2 border-gray-200">
                      {task.content}
                    </p>
                  </details>
                )}
                
                <div className="flex flex-wrap items-center gap-2">
                  {task.is_flagged && (
                    <Badge variant="destructive" className="gap-1">
                      <Flag className="h-3 w-3" />
                      Flagged
                    </Badge>
                  )}
                  
                  {task.category && (
                    <Badge variant="secondary">{task.category}</Badge>
                  )}
                  
                  {dueInfo && (
                    <Badge variant={dueInfo.variant} className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {dueInfo.label}
                    </Badge>
                  )}
                  
                  <Badge 
                    variant="outline" 
                    className={cn("gap-1", getPriorityColor(task.priority))}
                  >
                    {task.priority}
                  </Badge>

                  {showPhone && task.users?.phone_number && (
                    <Badge variant="outline" className="text-xs">
                      {task.users.phone_number.slice(-10)}
                    </Badge>
                  )}
                </div>
                
                {/* Date Added */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  <span>Added {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                </div>
              </>
            )}
          </div>

          {/* Actions Menu */}
          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFlag}>
                  <Flag className="h-4 w-4 mr-2" />
                  {task.is_flagged ? "Unflag" : "Flag"}
                </DropdownMenuItem>
                
                {/* Change Category Submenu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <Tag className="h-4 w-4 mr-2" />
                      Change Category
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" align="start">
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => handleChangeCategory(cat)}
                        className={cn(task.category === cat && "bg-accent")}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

