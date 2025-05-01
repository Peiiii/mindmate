"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 导入模块上下文
import { useModules } from "../context/module-context"

interface MemoryItem {
  id: string
  date: Date
  title: string
  preview: string
  type: "note" | "insight" | "connection"
}

export default function TimeMemory() {
  const [expanded, setExpanded] = useState(false)
  const [activeDate, setActiveDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")

  // 使用模块上下文
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const moduleId = "time-memory"
  const minimized = isMinimized(moduleId)

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id: moduleId,
      name: "时间记忆",
      icon: <Clock className="h-4 w-4 text-primary" />,
      restore: () => restoreModule(moduleId),
    })
  }

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  // Sample memory items
  const memoryItems: MemoryItem[] = [
    {
      id: "1",
      date: new Date(),
      title: "产品设计会议笔记",
      preview: "讨论了新功能的用户体验设计方案...",
      type: "note",
    },
    {
      id: "2",
      date: new Date(),
      title: "用户研究洞察",
      preview: "发现用户在首次使用时遇到的主要障碍...",
      type: "insight",
    },
    {
      id: "3",
      date: new Date(Date.now() - 86400000), // yesterday
      title: "设计系统与认知负荷",
      preview: "探索如何通过设计系统减轻用户认知负荷...",
      type: "connection",
    },
    {
      id: "4",
      date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      title: "竞品分析框架",
      preview: "建立了评估竞争产品的多维度框架...",
      type: "note",
    },
  ]

  // Filter items by active date
  const filteredItems = memoryItems.filter((item) => {
    if (viewMode === "day") {
      return item.date.toDateString() === activeDate.toDateString()
    } else if (viewMode === "week") {
      // Simple week filter (not exact)
      const diffTime = Math.abs(item.date.getTime() - activeDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays < 7
    } else {
      return item.date.getMonth() === activeDate.getMonth() && item.date.getFullYear() === activeDate.getFullYear()
    }
  })

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(activeDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setActiveDate(newDate)
  }

  const formatDate = () => {
    if (viewMode === "day") {
      return activeDate.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    } else if (viewMode === "week") {
      const startOfWeek = new Date(activeDate)
      startOfWeek.setDate(activeDate.getDate() - activeDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("zh-CN", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return activeDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })
    }
  }

  return (
    <motion.div
      className={`fixed ${
        expanded ? "inset-10" : "bottom-24 right-24 w-80 h-96"
      } bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-300`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">时间记忆</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={handleMinimize}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="p-3 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={() => navigateDate("prev")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="text-sm font-medium">{formatDate()}</div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={() => navigateDate("next")}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            size="sm"
            className={`text-xs flex-1 ${viewMode !== "day" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
            onClick={() => setViewMode("day")}
          >
            日
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            className={`text-xs flex-1 ${viewMode !== "week" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
            onClick={() => setViewMode("week")}
          >
            周
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            className={`text-xs flex-1 ${viewMode !== "month" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
            onClick={() => setViewMode("month")}
          >
            月
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: expanded ? "calc(100% - 106px)" : "calc(100% - 106px)" }}>
        {filteredItems.length > 0 ? (
          <div className="p-3 space-y-2">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-3 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          item.type === "note" ? "bg-blue-400" : item.type === "insight" ? "bg-amber-400" : "bg-primary"
                        }`}
                      />
                      <div>
                        <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                        <p className="text-xs text-zinc-400">{item.preview}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          <span className="text-xs text-zinc-500">
                            {item.date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">没有记忆项目</div>
        )}
      </div>
    </motion.div>
  )
}
