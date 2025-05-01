"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Lightbulb, Zap, ArrowRight, Minimize2, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// 导入模块上下文
import { useModules } from "../context/module-context"

interface Insight {
  id: string
  type: "pattern" | "suggestion" | "connection" | "question"
  title: string
  description: string
  confidence: number
  isNew: boolean
}

export default function AIInsights() {
  const [expanded, setExpanded] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      type: "pattern",
      title: "思考模式识别",
      description: "你倾向于在讨论产品设计时先关注用户体验，再考虑技术实现。这种模式有助于确保产品以用户为中心。",
      confidence: 92,
      isNew: true,
    },
    {
      id: "2",
      type: "suggestion",
      title: "知识拓展建议",
      description: "基于你最近的笔记，你可能对'认知心理学在设计中的应用'感兴趣。这将补充你当前的设计思路。",
      confidence: 85,
      isNew: true,
    },
    {
      id: "3",
      type: "connection",
      title: "概念关联发现",
      description: "你提到的'用户旅程地图'与三个月前记录的'服务设计蓝图'有强关联，可以结合思考。",
      confidence: 78,
      isNew: false,
    },
    {
      id: "4",
      type: "question",
      title: "思考引导问题",
      description: "你是否考虑过如何将这个设计理念应用到不同文化背景的用户群体中？这可能会带来新的设计挑战。",
      confidence: 70,
      isNew: false,
    },
  ])
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null)
  const [thinking, setThinking] = useState(false)
  const [progress, setProgress] = useState(0)

  // 使用模块上下文
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const moduleId = "ai-insights"
  const minimized = isMinimized(moduleId)

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id: moduleId,
      name: "AI 洞察",
      icon: <Sparkles className="h-4 w-4 text-primary" />,
      restore: () => restoreModule(moduleId),
    })
  }

  // Simulate AI thinking
  useEffect(() => {
    if (thinking) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setThinking(false)
            clearInterval(interval)
            return 0
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [thinking])

  // Simulate new insight after thinking completes
  useEffect(() => {
    if (!thinking && progress >= 100) {
      const newInsight: Insight = {
        id: `${insights.length + 1}`,
        type: "connection",
        title: "创意思维模式",
        description: "你的笔记显示你在解决问题时经常采用发散思维，这与你之前记录的设计思维方法形成了互补。",
        confidence: 88,
        isNew: true,
      }

      setTimeout(() => {
        setInsights((prev) => [newInsight, ...prev])
      }, 500)
    }
  }, [thinking, progress, insights])

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((insight) => insight.id !== id))
    if (activeInsight?.id === id) {
      setActiveInsight(null)
    }
  }

  const startThinking = () => {
    setThinking(true)
    setProgress(0)
  }

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  return (
    <motion.div
      className={`fixed ${
        expanded ? "inset-10" : "left-6 top-20 w-80 h-96"
      } bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-300`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">AI 洞察</h3>
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

      <div className="overflow-y-auto" style={{ height: expanded ? "calc(100% - 106px)" : "calc(100% - 106px)" }}>
        <AnimatePresence>
          {activeInsight ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {activeInsight.type === "pattern" && <Sparkles className="h-4 w-4 text-primary" />}
                  {activeInsight.type === "suggestion" && <Lightbulb className="h-4 w-4 text-amber-400" />}
                  {activeInsight.type === "connection" && <Zap className="h-4 w-4 text-blue-400" />}
                  {activeInsight.type === "question" && <Sparkles className="h-4 w-4 text-green-400" />}
                  <h4 className="text-sm font-medium">{activeInsight.title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={() => setActiveInsight(null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Card className="p-3 bg-zinc-800/50 border-zinc-700 mb-3">
                <p className="text-sm">{activeInsight.description}</p>
              </Card>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <p className="text-xs text-zinc-500">置信度 {activeInsight.confidence}%</p>
                </div>
                {activeInsight.isNew && (
                  <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20">
                    新洞察
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                >
                  <span>探索相关概念</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                >
                  <span>应用到当前笔记</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                  onClick={() => dismissInsight(activeInsight.id)}
                >
                  <span>忽略此洞察</span>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3"
            >
              {thinking ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm">AI 正在思考中...</p>
                    <p className="text-xs text-zinc-500">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mb-3 justify-center text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                  onClick={startThinking}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  生成新洞察
                </Button>
              )}

              <div className="space-y-2">
                <AnimatePresence>
                  {insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative group"
                    >
                      <Card
                        className="p-3 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                        onClick={() => setActiveInsight(insight)}
                      >
                        <div className="flex items-start gap-2">
                          {insight.type === "pattern" && <Sparkles className="h-4 w-4 text-primary mt-0.5" />}
                          {insight.type === "suggestion" && <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5" />}
                          {insight.type === "connection" && <Zap className="h-4 w-4 text-blue-400 mt-0.5" />}
                          {insight.type === "question" && <Sparkles className="h-4 w-4 text-green-400 mt-0.5" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{insight.title}</h4>
                              {insight.isNew && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20"
                                >
                                  新
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{insight.description}</p>
                          </div>
                        </div>
                      </Card>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          dismissInsight(insight.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {insights.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">没有可用的洞察</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">AI 洞察基于你的笔记和思考模式</p>
          <Button variant="ghost" size="sm" className="h-6 text-xs bg-zinc-800/50 hover:bg-zinc-700/50">
            设置
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
