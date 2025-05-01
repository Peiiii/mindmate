"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowRight, Lightbulb, Zap, Brain, BookOpen, Clock } from "lucide-react"

export default function AIAssistant() {
  const [insights, setInsights] = useState([
    "你的笔记中提到了「项目进度」，要不要创建一个时间线视图？",
    "我注意到你经常记录关于「机器学习」的内容，要汇总成知识图谱吗？",
    "这个想法与你上周的笔记有关联，要一起查看吗？",
  ])

  const [activeTab, setActiveTab] = useState<"insights" | "suggestions" | "thinking">("insights")

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "insights" ? "default" : "outline"}
          size="sm"
          className={`text-xs flex-1 ${activeTab !== "insights" ? "bg-zinc-900 border-zinc-800" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          洞察
        </Button>
        <Button
          variant={activeTab === "suggestions" ? "default" : "outline"}
          size="sm"
          className={`text-xs flex-1 ${activeTab !== "suggestions" ? "bg-zinc-900 border-zinc-800" : ""}`}
          onClick={() => setActiveTab("suggestions")}
        >
          <Zap className="h-3.5 w-3.5 mr-1" />
          建议
        </Button>
        <Button
          variant={activeTab === "thinking" ? "default" : "outline"}
          size="sm"
          className={`text-xs flex-1 ${activeTab !== "thinking" ? "bg-zinc-900 border-zinc-800" : ""}`}
          onClick={() => setActiveTab("thinking")}
        >
          <Brain className="h-3.5 w-3.5 mr-1" />
          思考
        </Button>
      </div>

      <div className="space-y-4">
        {activeTab === "insights" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">思维洞察</h3>
            </div>

            <div className="space-y-2">
              {insights.map((insight, i) => (
                <Card
                  key={i}
                  className="bg-zinc-900 border-zinc-800 p-3 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-zinc-300">{insight}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">智能操作</h3>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <span>生成会议摘要</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <span>提取关键行动项</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <span>连接相关资源</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-medium">知识推荐</h3>
              </div>

              <div className="space-y-2">
                <Card className="bg-zinc-900 border-zinc-800 p-3 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <h4 className="text-sm font-medium mb-1">认知心理学在设计中的应用</h4>
                  <p className="text-xs text-zinc-400 mb-2">
                    这篇文章探讨了如何利用认知心理学原理来优化用户体验设计...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <p className="text-xs text-zinc-500">相关度 95%</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      查看
                    </Button>
                  </div>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 p-3 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <h4 className="text-sm font-medium mb-1">多模态交互的未来趋势</h4>
                  <p className="text-xs text-zinc-400 mb-2">随着技术的发展，未来的人机交互将越来越依赖多模态输入...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <p className="text-xs text-zinc-500">相关度 87%</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      查看
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" />
                <h3 className="text-sm font-medium">时间回顾</h3>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <span>查看上周相关笔记</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <span>生成月度思考总结</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "thinking" && <div>{/* Content for the "Thinking" tab */}</div>}
      </div>
    </div>
  )
}
