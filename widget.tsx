"use client"

import React from "react"

/* --------------------------------------------------------------------
   BROWSER-ONLY STUB ─ lets Next.js preview render without the real
   Figma runtime.  When the widget actually runs in Figma this block
   is skipped because `window` is undefined in that sandbox.
---------------------------------------------------------------------*/
if (
  typeof window !== "undefined" && // we're in a browser
  typeof (globalThis as any).figma === "undefined"
) {
  ;(globalThis as any).figma = {
    widget: {
      useSyncedState: <T,>(_: string, initial: T) => React.useState<T>(initial),
      usePropertyMenu: () => {},
      /* Very small visual shims so components still render in preview */
      AutoLayout: ({
        direction,
        spacing = 4,
        padding = 0,
        fill,
        stroke,
        strokeWidth,
        cornerRadius,
        width,
        onClick,
        children,
      }: any) => (
        <div
          style={{
            display: "flex",
            flexDirection: direction === "horizontal" ? "row" : "column",
            gap: spacing,
            padding,
            background: fill,
            border: stroke ? `${strokeWidth ?? 1}px solid ${stroke}` : undefined,
            borderRadius: cornerRadius,
            width: width === "fill-parent" ? "100%" : width,
          }}
          onClick={onClick}
        >
          {children}
        </div>
      ),
      Text: ({ fontSize, fontWeight, fill, onClick, children }: any) => (
        <span style={{ fontSize, fontWeight, color: fill }} onClick={onClick}>
          {children}
        </span>
      ),
      Input: ({ value, placeholder, fontSize, onTextEditEnd }: any) => (
        <input
          style={{
            fontSize,
            padding: 4,
            border: "1px solid #d1d5db",
            borderRadius: 4,
            width: "100%",
          }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onTextEditEnd?.({ characters: e.target.value })}
        />
      ),
    },
    currentUser: { name: "Preview User" },
    currentPage: { selection: [] },
    notify: (msg: string) => console.log(`[figma.notify] ${msg}`),
  }
}

// Declare figma as a global variable to avoid linting errors when running outside of Figma
declare var figma: any

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Input } = widget

interface LogEntry {
  id: string
  type: "decision" | "rationale" | "debt" | "insight" | "journal"
  title: string
  author: string
  date: string
  nodeId?: string
  data: Record<string, string>
  color: string
}

const CATEGORY_CONFIG = {
  decision: {
    icon: "📝",
    color: "#3B82F6",
    label: "Decision Log",
    fields: ["title", "description", "reasoning", "status"],
  },
  rationale: {
    icon: "🧠",
    color: "#8B5CF6",
    label: "Design Rationale",
    fields: ["title", "reasoning", "research", "constraints", "persona"],
  },
  debt: {
    icon: "🚩",
    color: "#EF4444",
    label: "UX Debt Tag",
    fields: ["title", "problem", "severity", "fix", "assignee"],
  },
  insight: {
    icon: "🧪",
    color: "#10B981",
    label: "Usability Insight",
    fields: ["title", "task", "behavior", "quote", "improvement"],
  },
  journal: {
    icon: "✍️",
    color: "#F59E0B",
    label: "UX Journal Entry",
    fields: ["title", "worked_on", "decisions", "feedback", "blockers", "next_steps", "reflection"],
  },
}

function Widget() {
  const [entries, setEntries] = useSyncedState<LogEntry[]>("entries", [])
  const [isExpanded, setIsExpanded] = useSyncedState("isExpanded", false)
  const [selectedType, setSelectedType] = useSyncedState("selectedType", "")
  const [isCreating, setIsCreating] = useSyncedState("isCreating", false)
  const [filterType, setFilterType] = useSyncedState("filterType", "all")
  const [searchQuery, setSearchQuery] = useSyncedState("searchQuery", "")
  const [formData, setFormData] = useSyncedState<Record<string, string>>("formData", {})

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Add Decision Log",
        propertyName: "add-decision",
      },
      {
        itemType: "action",
        tooltip: "Add Design Rationale",
        propertyName: "add-rationale",
      },
      {
        itemType: "action",
        tooltip: "Add UX Debt",
        propertyName: "add-debt",
      },
      {
        itemType: "action",
        tooltip: "Add Usability Insight",
        propertyName: "add-insight",
      },
      {
        itemType: "action",
        tooltip: "Add Journal Entry",
        propertyName: "add-journal",
      },
      {
        itemType: "separator",
      },
      {
        itemType: "action",
        tooltip: "Export All Entries",
        propertyName: "export",
      },
    ],
    ({ propertyName }) => {
      if (propertyName && propertyName.startsWith("add-")) {
        const type = propertyName.replace("add-", "")
        startCreating(type)
      } else if (propertyName === "export") {
        exportEntries()
      }
    },
  )

  function startCreating(type: string) {
    setSelectedType(type)
    setIsCreating(true)
    setIsExpanded(true)
    setFormData({})
  }

  function saveEntry() {
    if (!formData.title || !formData.title.trim()) return

    const config = CATEGORY_CONFIG[selectedType as keyof typeof CATEGORY_CONFIG]
    if (!config) return

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      type: selectedType as LogEntry["type"],
      title: formData.title,
      author: figma.currentUser?.name || "Unknown",
      date: new Date().toLocaleDateString(),
      nodeId: figma.currentPage.selection[0]?.id,
      data: { ...formData },
      color: config.color,
    }

    setEntries([...entries, newEntry])
    setIsCreating(false)
    setFormData({})
  }

  function exportEntries() {
    figma.notify(`Exported ${entries.length} entries`)
  }

  function getFieldPlaceholder(field: string): string {
    const placeholders: Record<string, string> = {
      title: "Enter title...",
      description: "Describe the decision...",
      reasoning: "Why was this decision made?",
      status: "Proposed/Approved/Reversed",
      research: "Link to research or reference",
      constraints: "Technical, business, or time constraints",
      persona: "Which user or goal is impacted?",
      problem: "Summarize the problem",
      severity: "Low/Medium/High",
      fix: "Suggested solution",
      assignee: "Who should fix this?",
      task: "What task or flow was observed?",
      behavior: "What behavior or blocker occurred?",
      quote: "User quote (optional)",
      improvement: "Suggested improvement",
      worked_on: "What did you work on today?",
      decisions: "Key decisions made",
      feedback: "Feedback received",
      blockers: "Frictions or blockers encountered",
      next_steps: "What are the next steps?",
      reflection: "Personal reflection",
    }
    return placeholders[field] || "Enter value..."
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filterType === "all" || entry.type === filterType
    const matchesSearch =
      !searchQuery ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(entry.data).toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (!isExpanded && entries.length === 0) {
    return (
      <AutoLayout
        direction="vertical"
        spacing={8}
        padding={16}
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth={1}
        cornerRadius={8}
        onClick={() => setIsExpanded(true)}
      >
        <Text fontSize={14} fontWeight={600}>
          UX Documentation Hub
        </Text>
        <Text fontSize={12} fill="#6B7280">
          Click to add your first entry
        </Text>
      </AutoLayout>
    )
  }

  if (!isExpanded) {
    return (
      <AutoLayout
        direction="horizontal"
        spacing={4}
        padding={8}
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth={1}
        cornerRadius={6}
        onClick={() => setIsExpanded(true)}
      >
        <Text fontSize={12} fontWeight={500}>
          {entries.length} entries
        </Text>
        <Text fontSize={10} fill="#6B7280">
          📝🧠🚩🧪✍️
        </Text>
      </AutoLayout>
    )
  }

  return (
    <AutoLayout
      direction="vertical"
      spacing={12}
      padding={16}
      fill="#FFFFFF"
      stroke="#E5E7EB"
      strokeWidth={1}
      cornerRadius={8}
      width={400}
    >
      <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
        <Text fontSize={16} fontWeight={600}>
          UX Documentation Hub
        </Text>
        <AutoLayout spacing={4} width="fill-parent" horizontalAlignItems="end">
          <Text fontSize={12} fill="#6B7280" onClick={() => setIsExpanded(false)}>
            Minimize
          </Text>
        </AutoLayout>
      </AutoLayout>

      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        <Input
          value={searchQuery}
          placeholder="Search entries..."
          onTextEditEnd={(e) => setSearchQuery(e.characters)}
          fontSize={12}
          width="fill-parent"
          inputFrameProps={{
            fill: "#F9FAFB",
            stroke: "#E5E7EB",
            strokeWidth: 1,
            cornerRadius: 4,
            padding: 8,
          }}
        />

        <AutoLayout direction="horizontal" spacing={4} width="fill-parent">
          {["all", "decision", "rationale", "debt", "insight", "journal"].map((type) => (
            <AutoLayout
              key={type}
              padding={{ horizontal: 8, vertical: 4 }}
              fill={filterType === type ? "#3B82F6" : "#F3F4F6"}
              cornerRadius={4}
              onClick={() => setFilterType(type)}
            >
              <Text
                fontSize={10}
                fill={filterType === type ? "#FFFFFF" : "#374151"}
                fontWeight={filterType === type ? 600 : 400}
              >
                {type === "all" ? "All" : CATEGORY_CONFIG[type as keyof typeof CATEGORY_CONFIG]?.icon || type}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>

      {isCreating && (
        <AutoLayout direction="vertical" spacing={8} width="fill-parent" padding={12} fill="#F9FAFB" cornerRadius={6}>
          <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
            <Text fontSize={14} fontWeight={600}>
              {CATEGORY_CONFIG[selectedType as keyof typeof CATEGORY_CONFIG]?.icon || ""}{" "}
              {CATEGORY_CONFIG[selectedType as keyof typeof CATEGORY_CONFIG]?.label || ""}
            </Text>
          </AutoLayout>

          {selectedType &&
            CATEGORY_CONFIG[selectedType as keyof typeof CATEGORY_CONFIG] &&
            CATEGORY_CONFIG[selectedType as keyof typeof CATEGORY_CONFIG].fields.map((field) => (
              <AutoLayout key={field} direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={11} fill="#374151" fontWeight={500}>
                  {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
                <Input
                  value={formData[field] || ""}
                  placeholder={getFieldPlaceholder(field)}
                  onTextEditEnd={(e) => setFormData({ ...formData, [field]: e.characters })}
                  fontSize={11}
                  width="fill-parent"
                  inputFrameProps={{
                    fill: "#FFFFFF",
                    stroke: "#D1D5DB",
                    strokeWidth: 1,
                    cornerRadius: 4,
                    padding: 6,
                  }}
                />
              </AutoLayout>
            ))}

          <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
            <AutoLayout padding={{ horizontal: 12, vertical: 6 }} fill="#3B82F6" cornerRadius={4} onClick={saveEntry}>
              <Text fontSize={11} fill="#FFFFFF" fontWeight={500}>
                Save
              </Text>
            </AutoLayout>
            <AutoLayout
              padding={{ horizontal: 12, vertical: 6 }}
              fill="#F3F4F6"
              cornerRadius={4}
              onClick={() => setIsCreating(false)}
            >
              <Text fontSize={11} fill="#374151">
                Cancel
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}

      {!isCreating && (
        <AutoLayout direction="horizontal" spacing={4} width="fill-parent">
          {Object.entries(CATEGORY_CONFIG).map(([type, config]) => (
            <AutoLayout
              key={type}
              padding={{ horizontal: 8, vertical: 6 }}
              fill={config.color}
              cornerRadius={4}
              onClick={() => startCreating(type)}
            >
              <Text fontSize={10} fill="#FFFFFF">
                {config.icon}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      )}

      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        {filteredEntries.map((entry) => (
          <AutoLayout
            key={entry.id}
            direction="vertical"
            spacing={6}
            padding={10}
            width="fill-parent"
            fill="#FFFFFF"
            stroke={entry.color}
            strokeWidth={2}
            cornerRadius={6}
          >
            <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
              <Text fontSize={12}>{CATEGORY_CONFIG[entry.type]?.icon || ""}</Text>
              <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                <Text fontSize={12} fontWeight={600}>
                  {entry.title}
                </Text>
                <Text fontSize={10} fill="#6B7280">
                  {entry.author} • {entry.date}
                </Text>
              </AutoLayout>
            </AutoLayout>

            <AutoLayout direction="vertical" spacing={4} width="fill-parent">
              {Object.entries(entry.data).map(([key, value]) => {
                if (!value || key === "title") return null
                return (
                  <AutoLayout key={key} direction="vertical" spacing={2} width="fill-parent">
                    <Text fontSize={9} fill="#374151" fontWeight={500}>
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
                    </Text>
                    <Text fontSize={9} fill="#6B7280">
                      {String(value)}
                    </Text>
                  </AutoLayout>
                )
              })}
            </AutoLayout>
          </AutoLayout>
        ))}
      </AutoLayout>

      {filteredEntries.length === 0 && !isCreating && (
        <AutoLayout padding={20} width="fill-parent" horizontalAlignItems="center">
          <Text fontSize={12} fill="#9CA3AF">
            No entries found
          </Text>
        </AutoLayout>
      )}
    </AutoLayout>
  )
}

// Register only when running inside Figma
if (typeof figma !== "undefined" && figma.widget?.register) {
  figma.widget.register(Widget)
}

// Let Next.js (or any other bundler) import this file
export default Widget
