import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, Calendar, Plus } from "lucide-react";
import { NavBar } from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              WhatsApp To-Do AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Smart to-do lists powered by AI. Just send a WhatsApp message and watch your tasks organize themselves.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <CardTitle>WhatsApp Integration</CardTitle>
              </div>
              <CardDescription>
                Send messages directly to WhatsApp and they&apos;ll be automatically parsed into tasks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <CardTitle>AI-Powered Parsing</CardTitle>
              </div>
              <CardDescription>
                Advanced AI understands context, dates, priorities, and organizes tasks intelligently
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <CardTitle>Calendar Sync</CardTitle>
              </div>
              <CardDescription>
                Automatically sync tasks with your calendar and get smart reminders
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Try It Out
              </CardTitle>
              <CardDescription>
                Send a WhatsApp message like &quot;Finish design doc tomorrow&quot; and see it become a task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">WhatsApp Message</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      &quot;Finish design doc tomorrow&quot;
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300">→</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">AI Parsed Task</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">Finish design doc</span>
                      <Badge variant="secondary">Due: Tomorrow</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/actions" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Actions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Badge */}
        <div className="text-center mt-8">
          <Badge variant="outline" className="text-sm">
            🚧 MVP in Development
          </Badge>
        </div>
        </div>
      </div>
    </>
  );
}