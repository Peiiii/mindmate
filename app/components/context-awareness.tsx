"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Calendar, Users, BookOpen, Minimize2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// 首先，导入新的模块上下文
import { useModules } from "../context/module-context"

export default function ContextAwareness() {
  const [context, setContext] = useState({
    time: new Date(),
    location: "办公室",
    calendar: "产品评审会议 (30分钟后)",
    people: ["张三", "李四", "王五"],
    recentDocs: ["产品规划.md", "用户反馈.md"],
  })

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setContext((prev) => ({ ...prev, time: new Date() }))
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // 使用模块上下文
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const moduleId = "context-awareness"
  const minimized = isMinimized(moduleId)

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id: moduleId,
      name: "环境感知",
      icon: <MapPin className="h-4 w-4 text-primary" />,
      restore: () => restoreModule(moduleId),
    })
  }

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  return (
    <motion.div
      className="fixed top-20 right-6 w-64 z-10"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
    >
      <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 p-3 shadow-lg relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium text-zinc-400">环境感知</h3>
          <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1" onClick={handleMinimize}>
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-300">{context.time.toLocaleTimeString()}</p>
              <p className="text-xs text-zinc-500">{context.time.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1.5 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-300">{context.location}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1.5 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-300">{context.calendar}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1.5 rounded-full">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-300">附近的人</p>
              <p className="text-xs text-zinc-500">{context.people.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1.5 rounded-full">
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-300">相关文档</p>
              <p className="text-xs text-zinc-500">{context.recentDocs.join(", ")}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
