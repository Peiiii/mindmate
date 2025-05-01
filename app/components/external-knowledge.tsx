"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Search, ExternalLink, Clock, Bookmark, Minimize2, Maximize2, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 导入模块上下文
import { useModules } from "../context/module-context"

interface KnowledgeSource {
  id: string
  title: string
  source: string
  preview: string
  type: "article" | "book" | "research" | "video"
  relevance: number
  saved?: boolean
  lastAccessed?: Date
}

export default function ExternalKnowledge() {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [activeSource, setActiveSource] = useState<KnowledgeSource | null>(null)

  // 使用模块上下文
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const moduleId = "external-knowledge"
  const minimized = isMinimized(moduleId)

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id: moduleId,
      name: "知识库",
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      restore: () => restoreModule(moduleId),
    })
  }

  // Sample knowledge sources
  const knowledgeSources: KnowledgeSource[] = [
    {
      id: "1",
      title: "认知心理学在用户界面设计中的应用",
      source: "交互设计基础",
      preview: "本文探讨了如何利用认知心理学原理来优化用户界面设计，提高用户体验...",
      type: "article",
      relevance: 95,
      saved: true,
      lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "2",
      title: "设计思维：以用户为中心的产品开发方法",
      source: "产品设计手册",
      preview: "设计思维是一种以人为本的创新方法，它强调深入理解用户需求...",
      type: "book",
      relevance: 88,
      saved: true,
    },
    {
      id: "3",
      title: "情境感知系统的设计原则与实践",
      source: "人机交互学会期刊",
      preview: "情境感知系统能够根据用户所处环境自动调整其行为，本研究提出了设计此类系统的核心原则...",
      type: "research",
      relevance: 82,
    },
    {
      id: "4",
      title: "未来界面：多模态交互的发展趋势",
      source: "科技前沿讲座",
      preview: "随着技术的发展，未来的人机交互将越来越依赖多模态输入，包括语音、手势和眼动追踪...",
      type: "video",
      relevance: 75,
      lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 1500)
  }

  const formatDate = (date?: Date) => {
    if (!date) return ""

    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "今天"
    if (diffDays === 1) return "昨天"
    if (diffDays < 7) return `${diffDays}天前`

    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-3.5 w-3.5 text-blue-400" />
      case "book":
        return <BookOpen className="h-3.5 w-3.5 text-primary" />
      case "research":
        return <BookOpen className="h-3.5 w-3.5 text-green-400" />
      case "video":
        return <BookOpen className="h-3.5 w-3.5 text-amber-400" />
      default:
        return <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
    }
  }

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  return (
    <motion.div
      className={`fixed ${
        expanded ? "inset-10" : "bottom-24 left-24 w-80 h-96"
      } bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">知识库</h3>
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
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              className="pl-8 h-8 text-sm bg-zinc-800/50 border-zinc-700 focus-visible:ring-primary"
              placeholder="搜索知识库..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          </div>
          <Button size="sm" className="h-8" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? "搜索中..." : "搜索"}
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: expanded ? "calc(100% - 106px)" : "calc(100% - 106px)" }}>
        <AnimatePresence mode="wait">
          {activeSource ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getSourceIcon(activeSource.type)}
                  <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                    {activeSource.type === "article"
                      ? "文章"
                      : activeSource.type === "book"
                        ? "书籍"
                        : activeSource.type === "research"
                          ? "研究"
                          : "视频"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={() => setActiveSource(null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <h4 className="text-base font-medium mb-2">{activeSource.title}</h4>
              <p className="text-sm text-zinc-400 mb-3">来源: {activeSource.source}</p>

              <Card className="p-3 bg-zinc-800/50 border-zinc-700 mb-3">
                <p className="text-sm">{activeSource.preview}</p>
                <p className="text-sm mt-2">
                  这是一个示例预览内容。在实际产品中，这里将显示从外部知识源提取的相关内容摘要，
                  以帮助用户快速了解该资源的核心内容，并判断其与当前工作的相关性。
                </p>
              </Card>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <p className="text-xs text-zinc-500">相关度 {activeSource.relevance}%</p>
                </div>
                {activeSource.lastAccessed && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <p className="text-xs text-zinc-500">{formatDate(activeSource.lastAccessed)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                >
                  <span>打开完整内容</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                >
                  <span>引用到笔记</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
                >
                  <span>{activeSource.saved ? "已收藏" : "收藏"}</span>
                  <Bookmark className={`h-3.5 w-3.5 ${activeSource.saved ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Tabs defaultValue="relevant" className="w-full">
                <div className="px-3 pt-3">
                  <TabsList className="w-full bg-zinc-800/50">
                    <TabsTrigger value="relevant" className="text-xs flex-1">
                      相关推荐
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="text-xs flex-1">
                      最近访问
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="text-xs flex-1">
                      已收藏
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="relevant" className="p-3 pt-2 space-y-2">
                  {knowledgeSources
                    .sort((a, b) => b.relevance - a.relevance)
                    .map((source) => (
                      <Card
                        key={source.id}
                        className="p-3 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                        onClick={() => setActiveSource(source)}
                      >
                        <div className="flex items-start gap-2">
                          {getSourceIcon(source.type)}
                          <div>
                            <h4 className="text-sm font-medium">{source.title}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{source.source}</p>
                            <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{source.preview}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                <p className="text-xs text-zinc-500">相关度 {source.relevance}%</p>
                              </div>
                              {source.saved && <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="recent" className="p-3 pt-2 space-y-2">
                  {knowledgeSources
                    .filter((source) => source.lastAccessed)
                    .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
                    .map((source) => (
                      <Card
                        key={source.id}
                        className="p-3 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                        onClick={() => setActiveSource(source)}
                      >
                        <div className="flex items-start gap-2">
                          {getSourceIcon(source.type)}
                          <div>
                            <h4 className="text-sm font-medium">{source.title}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Clock className="h-3 w-3 text-zinc-500" />
                              <p className="text-xs text-zinc-500">{formatDate(source.lastAccessed)}</p>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{source.preview}</p>
                          </div>
                        </div>
                      </Card>
                    ))}

                  {knowledgeSources.filter((source) => source.lastAccessed).length === 0 && (
                    <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
                      没有最近访问的资源
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="p-3 pt-2 space-y-2">
                  {knowledgeSources
                    .filter((source) => source.saved)
                    .map((source) => (
                      <Card
                        key={source.id}
                        className="p-3 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                        onClick={() => setActiveSource(source)}
                      >
                        <div className="flex items-start gap-2">
                          {getSourceIcon(source.type)}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium">{source.title}</h4>
                              <Bookmark className="h-3.5 w-3.5 fill-primary text-primary shrink-0 ml-2" />
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{source.source}</p>
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{source.preview}</p>
                          </div>
                        </div>
                      </Card>
                    ))}

                  {knowledgeSources.filter((source) => source.saved).length === 0 && (
                    <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">没有收藏的资源</div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
