"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { withFloatingModule } from "./hoc/with-floating-module"
import { cn } from "@/lib/utils"

// 定义聊天助手的名称
export const CHAT_AGENT_NAME = {
  zh: "思维伙伴",
  en: "MindMate",
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

function ChatAgentContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `你好！我是${CHAT_AGENT_NAME.zh}，你的AI对话助手。有什么我可以帮助你的吗？`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const responses = [
        "我理解你的问题，让我思考一下...",
        "这是一个很好的问题！根据我的分析...",
        "我可以帮你解决这个问题。首先，我们需要考虑...",
        "根据最新的研究和数据，我认为...",
        "这个问题有几个不同的角度可以思考...",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("flex gap-2 max-w-[80%]", message.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <Avatar className="h-8 w-8">
                {message.role === "user" ? (
                  <>
                    <AvatarImage src="/placeholder.svg?key=user" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder.svg?key=bot" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <Card
                  className={cn(
                    "p-3",
                    message.role === "user" ? "bg-primary/20 border-primary/30" : "bg-zinc-800/50 border-zinc-700",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </Card>
                <p className="text-xs text-zinc-500 mt-1 px-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-zinc-800/50 border-zinc-700">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <p className="text-sm">思考中...</p>
                </div>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            className="bg-zinc-800/50 border-zinc-700 focus-visible:ring-primary"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// 使用高阶组件将普通组件转换为浮动模块
const ChatAgent = withFloatingModule(ChatAgentContent, {
  id: "chat-agent",
  title: `${CHAT_AGENT_NAME.zh} (${CHAT_AGENT_NAME.en})`,
  icon: <Sparkles className="h-4 w-4 text-blue-400" />,
  moduleConfig: {
    defaultPosition: { x: "right", y: "center" },
    defaultSize: { width: 360, height: 480 },
    allowResize: true,
    allowClose: true,
    zIndex: 15,
  },
})

export default ChatAgent
