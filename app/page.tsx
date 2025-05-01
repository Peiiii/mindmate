"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Sparkles, PenTool, Layers, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import NoteCanvas from "./components/note-canvas"
import AIAssistant from "./components/ai-assistant"
import { ThoughtBubble } from "./components/thought-bubble"
import MultimodalInput from "./components/multimodal-input"
import ContextAwareness from "./components/context-awareness"
import KnowledgeGraph from "./components/knowledge-graph"
import SemanticConnections from "./components/semantic-connections"
import VoiceTranscription from "./components/voice-transcription"
import TimeMemory from "./components/time-memory"
import CollaborativeSpace from "./components/collaborative-space"
import AIInsights from "./components/ai-insights"
import ExternalKnowledge from "./components/external-knowledge"
import { ModuleProvider } from "./context/module-context"
import Taskbar from "./components/taskbar"
import ModuleManager from "./components/module-manager"
// 导入聊天Agent组件
import ChatAgent from "./components/chat-agent"

// 主内容组件
function MainContent() {
  const [showAssistant, setShowAssistant] = useState(false)
  const [thoughts, setThoughts] = useState<string[]>([])
  const [mode, setMode] = useState<"canvas" | "writing">("writing")

  // Simulate thought capture
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      if (thoughts.length < 3) {
        setThoughts((prev) => [
          ...prev,
          ["我需要整理下周的会议安排", "这个想法可以和上周的项目联系起来", "记得查阅相关研究资料"][thoughts.length],
        ])
      } else {
        clearInterval(thoughtInterval)
      }
    }, 2000)

    return () => clearInterval(thoughtInterval)
  }, [thoughts])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Minimalist header */}
      <header className="border-b border-zinc-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-light">思维空间</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
            onClick={() => setMode(mode === "canvas" ? "writing" : "canvas")}
          >
            {mode === "canvas" ? <PenTool className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
          </Button>
          <Button
            variant={showAssistant ? "default" : "ghost"}
            size="sm"
            className={!showAssistant ? "text-zinc-400 hover:text-white" : ""}
            onClick={() => setShowAssistant(!showAssistant)}
          >
            <Brain className="h-4 w-4 mr-1" />
            助手
          </Button>
        </div>
      </header>
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Note taking area */}
        <div className="flex-1 p-6 relative">
          {mode === "writing" ? (
            <div className="max-w-2xl mx-auto">
              <textarea
                className="w-full h-64 bg-transparent text-xl font-light focus:outline-none resize-none"
                placeholder="开始记录你的想法..."
                autoFocus
              />

              {/* Floating thought bubbles */}
              <AnimatePresence>
                {thoughts.map((thought, i) => (
                  <ThoughtBubble
                    key={thought}
                    thought={thought}
                    position={{
                      x: [200, 300, 100][i % 3],
                      y: [100, 200, 150][i % 3],
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <NoteCanvas />
          )}
        </div>

        {/* AI Assistant */}
        {showAssistant && (
          <div className="w-80 border-l border-zinc-800">
            <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-medium">思维助手</h2>
            </div>
            <AIAssistant />
          </div>
        )}
      </div>
      {/* Multimodal input */}
      <MultimodalInput />
      {/* 浮动模块 */}
      <KnowledgeGraph />
      <ContextAwareness />
      <TimeMemory />
      <CollaborativeSpace />
      <AIInsights />
      <ExternalKnowledge />
      <VoiceTranscription />
      {/* 添加聊天Agent模块 */}
      <ChatAgent /> 
      {/* 语义连接 */}
      <SemanticConnections />
      {/* 任务栏 */}
      <Taskbar />
      {/* 模块管理器 */}
      <ModuleManager />
    </main>
  )
}

// 包装主应用，提供模块上下文
export default function HomePage() {
  return (
    <ModuleProvider>
      <MainContent />
    </ModuleProvider>
  )
}
