"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, Sparkles, X, ChevronRight } from "lucide-react"

interface Connection {
  id: number
  type: "concept" | "document" | "insight"
  title: string
  description: string
  relevance: number // 0-100
}

export default function SemanticConnections() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      type: "concept",
      title: "设计思维",
      description: "用户体验设计的核心方法论",
      relevance: 92,
    },
    {
      id: 2,
      type: "document",
      title: "产品规划.md",
      description: "上周编写的产品路线图文档",
      relevance: 85,
    },
    {
      id: 3,
      type: "insight",
      title: "用户反馈模式",
      description: "从用户调研中发现的关键模式",
      relevance: 78,
    },
    {
      id: 4,
      type: "concept",
      title: "认知负荷",
      description: "界面设计中需要考虑的心理学概念",
      relevance: 65,
    },
  ])

  const [showConnections, setShowConnections] = useState(false)
  const [activeConnection, setActiveConnection] = useState<Connection | null>(null)

  return (
    <div className="fixed bottom-24 right-6 z-10">
      <AnimatePresence>
        {activeConnection && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mb-2"
          >
            <Card className="bg-zinc-900/90 backdrop-blur-sm border-zinc-800 p-4 w-64 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                  {activeConnection.type === "concept" && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                  {activeConnection.type === "document" && <Link className="h-3.5 w-3.5 text-blue-400" />}
                  {activeConnection.type === "insight" && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                  <h3 className="text-sm font-medium">{activeConnection.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={() => setActiveConnection(null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-zinc-400 mb-3">{activeConnection.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <p className="text-xs text-zinc-500">相关度 {activeConnection.relevance}%</p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  查看详情
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`bg-zinc-900/90 backdrop-blur-sm border-zinc-800 shadow-lg ${
            showConnections ? "rounded-t-lg rounded-b-none border-b-0" : "rounded-lg"
          }`}
          onClick={() => setShowConnections(!showConnections)}
        >
          <Link className="h-4 w-4 mr-2" />
          语义连接
          <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showConnections ? "rotate-90" : ""}`} />
        </Button>

        <AnimatePresence>
          {showConnections && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="rounded-t-none bg-zinc-900/90 backdrop-blur-sm border-zinc-800 border-t-0 shadow-lg">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="p-2 hover:bg-zinc-800/50 rounded cursor-pointer transition-colors"
                      onClick={() => setActiveConnection(connection)}
                    >
                      <div className="flex items-center gap-2">
                        {connection.type === "concept" && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                        {connection.type === "document" && <Link className="h-3.5 w-3.5 text-blue-400" />}
                        {connection.type === "insight" && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                        <div>
                          <p className="text-xs font-medium">{connection.title}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-[180px]">{connection.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
