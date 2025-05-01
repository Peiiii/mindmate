"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Brain, BookOpen, Users, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import NoteCanvas from "./note-canvas"
import AIAssistant from "./ai-assistant"
import KnowledgeGraph from "./knowledge-graph"
import ContextAwareness from "./context-awareness"
import MultimodalInput from "./multimodal-input"
import TimeMemory from "./time-memory"
import CollaborativeSpace from "./collaborative-space"
import AIInsights from "./ai-insights"
import ExternalKnowledge from "./external-knowledge"
import { Badge } from "@/components/ui/badge"

export default function AdvancedPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "canvas" | "insights">("notes")
  const [showAssistant, setShowAssistant] = useState(true)
  const [showTimeMemory, setShowTimeMemory] = useState(true)
  const [showCollaboration, setShowCollaboration] = useState(true)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [showExternalKnowledge, setShowExternalKnowledge] = useState(true)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with advanced controls */}
      <header className="border-b border-zinc-800 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-light">思维空间</h1>
            </div>

            <div className="h-5 w-px bg-zinc-800 mx-1"></div>

            <div className="flex gap-1">
              <Button
                variant={activeTab === "notes" ? "default" : "ghost"}
                size="sm"
                className={`text-xs ${activeTab !== "notes" ? "text-zinc-400 hover:text-white" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                笔记
              </Button>
              <Button
                variant={activeTab === "canvas" ? "default" : "ghost"}
                size="sm"
                className={`text-xs ${activeTab !== "canvas" ? "text-zinc-400 hover:text-white" : ""}`}
                onClick={() => setActiveTab("canvas")}
              >
                画布
              </Button>
              <Button
                variant={activeTab === "insights" ? "default" : "ghost"}
                size="sm"
                className={`text-xs ${activeTab !== "insights" ? "text-zinc-400 hover:text-white" : ""}`}
                onClick={() => setActiveTab("insights")}
              >
                洞察
                <Badge className="ml-1 h-4 text-[10px] bg-primary/20 text-primary border-primary/10">3</Badge>
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-zinc-400 hover:text-white ${showAssistant ? "bg-zinc-800/50" : ""}`}
              onClick={() => setShowAssistant(!showAssistant)}
            >
              <Brain className="h-4 w-4 mr-1" />
              助手
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-zinc-400 hover:text-white ${showTimeMemory ? "bg-zinc-800/50" : ""}`}
              onClick={() => setShowTimeMemory(!showTimeMemory)}
            >
              <Clock className="h-4 w-4 mr-1" />
              时间
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-zinc-400 hover:text-white ${showCollaboration ? "bg-zinc-800/50" : ""}`}
              onClick={() => setShowCollaboration(!showCollaboration)}
            >
              <Users className="h-4 w-4 mr-1" />
              协作
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-zinc-400 hover:text-white ${showAIInsights ? "bg-zinc-800/50" : ""}`}
              onClick={() => setShowAIInsights(!showAIInsights)}
            >
              <Zap className="h-4 w-4 mr-1" />
              洞察
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-zinc-400 hover:text-white ${showExternalKnowledge ? "bg-zinc-800/50" : ""}`}
              onClick={() => setShowExternalKnowledge(!showExternalKnowledge)}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              知识库
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Main content */}
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === "notes" && (
              <div className="max-w-2xl mx-auto p-6">
                <textarea
                  className="w-full h-64 bg-transparent text-xl font-light focus:outline-none resize-none"
                  placeholder="开始记录你的想法..."
                  autoFocus
                />
              </div>
            )}

            {activeTab === "canvas" && <NoteCanvas />}

            {activeTab === "insights" && (
              <div className="max-w-3xl mx-auto p-6">
                <h2 className="text-2xl font-light mb-6">思维洞察</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">思维模式分析</h3>
                    </div>
                    <p className="text-zinc-300 mb-4">
                      基于你的笔记和思考习惯，我们发现你倾向于通过视觉化方式组织信息，并且经常在不同概念之间建立联系。
                      这种思维模式有助于创造性问题解决和跨领域创新。
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        查看详细分析
                      </Button>
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        应用到工作流程
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-amber-400" />
                      <h3 className="text-lg font-medium">知识关联建议</h3>
                    </div>
                    <p className="text-zinc-300 mb-4">
                      你最近的笔记与你三个月前研究的"认知增强技术"主题高度相关。
                      建议回顾这些早期笔记，可能会为当前项目提供新的视角和灵感。
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        查看相关笔记
                      </Button>
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        创建知识图谱
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-medium">创意拓展方向</h3>
                    </div>
                    <p className="text-zinc-300 mb-4">基于你当前的项目方向，以下领域可能值得探索：</p>
                    <ul className="list-disc list-inside mb-4 space-y-1 text-zinc-300">
                      <li>情境感知系统在日常生活中的应用</li>
                      <li>多模态交互如何增强认知能力</li>
                      <li>知识管理与个人成长的关系</li>
                    </ul>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        探索相关资源
                      </Button>
                      <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700">
                        生成研究计划
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* AI Assistant sidebar */}
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

      {/* Context awareness */}
      <ContextAwareness />

      {/* Knowledge graph */}
      <KnowledgeGraph />

      {/* Time memory */}
      {showTimeMemory && <TimeMemory />}

      {/* Collaborative space */}
      {showCollaboration && <CollaborativeSpace />}

      {/* AI insights */}
      {showAIInsights && <AIInsights />}

      {/* External knowledge */}
      {showExternalKnowledge && <ExternalKnowledge />}
    </div>
  )
}
