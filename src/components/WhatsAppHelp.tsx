"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, List, CheckCircle2, XCircle, HelpCircle } from "lucide-react"

export function WhatsAppHelp() {
  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <CardTitle>WhatsApp Commands</CardTitle>
        </div>
        <CardDescription>
          Send messages to your WhatsApp number to manage tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">Natural Language</Badge>
            <h3 className="text-sm font-semibold">Add Tasks</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 ml-4">
            <p>• "Buy groceries tomorrow"</p>
            <p>• "Call dentist next Tuesday high priority"</p>
            <p>• "Submit report by Friday"</p>
          </div>
        </div>

        {/* List Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <List className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold">List Tasks</h3>
          </div>
          <div className="text-sm text-muted-foreground ml-4">
            <p><code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">list</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">tasks</code> - Show all pending tasks</p>
          </div>
        </div>

        {/* Mark Complete */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-semibold">Mark Complete</h3>
          </div>
          <div className="text-sm text-muted-foreground ml-4">
            <p><code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">done 1</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">complete 2</code> - Complete task by number</p>
          </div>
        </div>

        {/* Cancel/Delete Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-semibold">Cancel Tasks</h3>
          </div>
          <div className="text-sm text-muted-foreground ml-4">
            <p><code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">cancel 1</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">delete 2</code> - Cancel task by number</p>
          </div>
        </div>

        {/* Help */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold">Get Help</h3>
          </div>
          <div className="text-sm text-muted-foreground ml-4">
            <p><code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">help</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">commands</code> - Show available commands</p>
          </div>
        </div>

        {/* AI Features Note */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> The AI automatically extracts dates, priorities, and categories from your messages!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

