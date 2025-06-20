"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UX Documentation Hub</h1>
          <p className="text-xl text-gray-600 mb-6">
            A comprehensive Figma widget that combines 5 essential UX documentation templates into one unified tool.
          </p>
          <Badge variant="secondary" className="text-sm">
            Figma Widget
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📝 Decision Log</CardTitle>
              <CardDescription>Track design decisions with reasoning and status</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Title and description</li>
                <li>• Reasoning behind decisions</li>
                <li>• Status tracking</li>
                <li>• Linked Figma nodes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧠 Design Rationale</CardTitle>
              <CardDescription>Document design thinking and constraints</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Core reasoning</li>
                <li>• Research references</li>
                <li>• Technical constraints</li>
                <li>• Persona impact</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🚩 UX Debt Tag</CardTitle>
              <CardDescription>Mark known issues and suggested fixes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Problem summary</li>
                <li>• Severity levels</li>
                <li>• Suggested fixes</li>
                <li>• Assignee tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧪 Usability Insight</CardTitle>
              <CardDescription>Capture user testing feedback and behaviors</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Observed tasks/flows</li>
                <li>• User behaviors</li>
                <li>• Direct quotes</li>
                <li>• Improvement suggestions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">✍️ UX Journal Entry</CardTitle>
              <CardDescription>Daily designer reflections and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Work completed</li>
                <li>• Key decisions made</li>
                <li>• Feedback received</li>
                <li>• Next steps</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔍 Key Features</CardTitle>
              <CardDescription>Built-in capabilities for better workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smart attachment to nodes</li>
                <li>• Auto-timestamping</li>
                <li>• Color-coded categories</li>
                <li>• Search & filter</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>How to add this widget to your Figma workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">For Figma Widget Development:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Copy the widget.tsx code to your Figma widget development environment</li>
                <li>Update the manifest.json with your widget details</li>
                <li>
                  Build using <code className="bg-gray-200 px-1 rounded">npm run build</code>
                </li>
                <li>Publish to your Figma workspace</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>How to use the UX Documentation Hub widget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Getting Started</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Add the widget to any Figma file</li>
                  <li>Click to expand and start documenting</li>
                  <li>Choose a category using colored buttons</li>
                  <li>Fill out the form with relevant information</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Best Practices</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Select frames before creating entries</li>
                  <li>Use consistent, descriptive titles</li>
                  <li>Tag UX debt as soon as identified</li>
                  <li>Document the "why" behind decisions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
