"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, MessageSquare, Share2, Globe, Lock, Eye, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 导入模块上下文
import { useModules } from "../context/module-context"

interface Collaborator {
  id: string
  name: string
  avatar: string
  status: "active" | "idle" | "offline"
  lastActive?: string
}

interface Comment {
  id: string
  user: string
  avatar: string
  text: string
  timestamp: Date
  reactions?: { emoji: string; count: number }[]
}

export default function CollaborativeSpace() {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"people" | "comments">("people")
  const [shareMode, setShareMode] = useState<"private" | "shared" | "public">("private")

  // 使用模块上下文
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const moduleId = "collaborative-space"
  const minimized = isMinimized(moduleId)

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id: moduleId,
      name: "协作空间",
      icon: <Users className="h-4 w-4 text-primary" />,
      restore: () => restoreModule(moduleId),
    })
  }

  // Sample collaborators
  const collaborators: Collaborator[] = [
    {
      id: "1",
      name: "张三",
      avatar: "/placeholder.svg?key=ukzlq",
      status: "active",
    },
    {
      id: "2",
      name: "李四",
      avatar: "/placeholder.svg?key=hrtnk",
      status: "active",
    },
    {
      id: "3",
      name: "王五",
      avatar: "/placeholder.svg?key=tgk99",
      status: "idle",
      lastActive: "10分钟前",
    },
    {
      id: "4",
      name: "赵六",
      avatar: "/placeholder.svg?key=b3qd9",
      status: "offline",
      lastActive: "1小时前",
    },
  ]

  // Sample comments
  const comments: Comment[] = [
    {
      id: "1",
      user: "张三",
      avatar: "/placeholder.svg?key=9aun1",
      text: "我认为我们应该更关注用户在首次使用时的体验，这对留存率有很大影响。",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      reactions: [
        { emoji: "👍", count: 2 },
        { emoji: "💡", count: 1 },
      ],
    },
    {
      id: "2",
      user: "李四",
      avatar: "/placeholder.svg?key=66i0n",
      text: "同意，我们可以添加一个引导流程来帮助新用户快速上手。",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    },
    {
      id: "3",
      user: "王五",
      avatar: "/placeholder.svg?key=ncw1p",
      text: "我已经开始设计引导流程的原型了，稍后会分享给大家。",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "刚刚"
    if (diffMins < 60) return `${diffMins}分钟前`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}小时前`

    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
  }

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  return (
    <motion.div
      className={`fixed ${
        expanded ? "inset-10" : "top-20 right-6 w-80 h-96"
      } bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-300`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">协作空间</h3>
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
          <div className="flex gap-1">
            <Button
              variant={shareMode === "private" ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${shareMode !== "private" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
              onClick={() => setShareMode("private")}
            >
              <Lock className="h-3 w-3 mr-1" />
              私密
            </Button>
            <Button
              variant={shareMode === "shared" ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${shareMode !== "shared" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
              onClick={() => setShareMode("shared")}
            >
              <Users className="h-3 w-3 mr-1" />
              共享
            </Button>
            <Button
              variant={shareMode === "public" ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${shareMode !== "public" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
              onClick={() => setShareMode("public")}
            >
              <Globe className="h-3 w-3 mr-1" />
              公开
            </Button>
          </div>

          <Button variant="outline" size="sm" className="text-xs bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50">
            <Share2 className="h-3 w-3 mr-1" />
            分享
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant={activeTab === "people" ? "default" : "ghost"}
            size="sm"
            className={`text-xs flex-1 ${activeTab !== "people" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
            onClick={() => setActiveTab("people")}
          >
            <Users className="h-3.5 w-3.5 mr-1" />
            协作者
          </Button>
          <Button
            variant={activeTab === "comments" ? "default" : "ghost"}
            size="sm"
            className={`text-xs flex-1 ${activeTab !== "comments" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            评论
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: expanded ? "calc(100% - 106px)" : "calc(100% - 106px)" }}>
        <AnimatePresence mode="wait">
          {activeTab === "people" ? (
            <motion.div
              key="people"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-medium text-zinc-400">当前协作者 ({collaborators.length})</h4>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 bg-zinc-800/50 hover:bg-zinc-700/50">
                  <UserPlus className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${
                            collaborator.status === "active"
                              ? "bg-green-500"
                              : collaborator.status === "idle"
                                ? "bg-amber-500"
                                : "bg-zinc-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm">{collaborator.name}</p>
                        {collaborator.status !== "active" && collaborator.lastActive && (
                          <p className="text-xs text-zinc-500">{collaborator.lastActive}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                      {collaborator.status === "active" ? "编辑中" : collaborator.status === "idle" ? "空闲" : "离线"}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-medium text-zinc-400 mb-2">访问权限</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-zinc-500" />
                      <p className="text-sm">查看权限</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                      所有人
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-zinc-500" />
                      <p className="text-sm">评论权限</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                      协作者
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-zinc-500" />
                      <p className="text-sm">编辑权限</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                      仅我
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="comments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3"
            >
              <div className="space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-3 bg-zinc-800/50 border-zinc-700">
                    <div className="flex gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                        <AvatarFallback>{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium">{comment.user}</p>
                          <p className="text-xs text-zinc-500">{formatTime(comment.timestamp)}</p>
                        </div>
                        <p className="text-sm text-zinc-300">{comment.text}</p>

                        {comment.reactions && comment.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {comment.reactions.map((reaction, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs h-5 bg-zinc-800/50 border-zinc-700"
                              >
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-3 relative">
                <textarea
                  className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="添加评论..."
                  rows={2}
                />
                <Button className="absolute bottom-2 right-2 h-6 text-xs" size="sm">
                  发送
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
