"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  X,
  Minimize2,
  BookOpen,
  Users,
  Layers,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useModules } from "../context/module-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TaskbarPosition } from "./taskbar"

export default function ModuleManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const {
    moduleConfigs,
    moduleStates,
    toggleModuleVisibility,
    taskbarPosition,
    setTaskbarPosition,
    applyLayoutPreset,
  } = useModules()

  const positionOptions: { value: TaskbarPosition; label: string; icon: React.ReactNode }[] = [
    { value: "left", label: "左侧", icon: <ArrowLeft className="h-4 w-4" /> },
    { value: "right", label: "右侧", icon: <ArrowRight className="h-4 w-4" /> },
    { value: "top", label: "顶部", icon: <ArrowUp className="h-4 w-4" /> },
    { value: "bottom", label: "底部", icon: <ArrowDown className="h-4 w-4" /> },
  ]

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>
    )
  }

  if (minimized) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg z-50"
        onClick={() => setMinimized(false)}
      >
        <Settings className="h-5 w-5 text-primary" />
      </Button>
    )
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 w-80 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg shadow-lg z-50 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
    >
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">模块管理器</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={() => setMinimized(true)}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <div className="px-3 pt-3">
          <TabsList className="w-full bg-zinc-800/50">
            <TabsTrigger value="modules" className="text-xs flex-1">
              模块
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs flex-1">
              布局
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="modules" className="p-3 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {Object.values(moduleConfigs).map((config) => (
              <Card key={config.id} className="p-3 bg-zinc-800/50 border-zinc-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{config.icon}</div>
                    <div>
                      <h4 className="text-sm font-medium">{config.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{config.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={moduleStates[config.id]?.visible ?? false}
                    onCheckedChange={() => toggleModuleVisibility(config.id)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="p-3">
          <Card className="p-3 bg-zinc-800/50 border-zinc-700 mb-4">
            <h4 className="text-sm font-medium mb-3">任务栏位置</h4>
            <div className="grid grid-cols-2 gap-2">
              {positionOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={taskbarPosition === option.value ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    taskbarPosition !== option.value ? "bg-zinc-800/50 border-zinc-700" : ""
                  }`}
                  onClick={() => setTaskbarPosition(option.value)}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-3 bg-zinc-800/50 border-zinc-700 mb-4">
            <h4 className="text-sm font-medium mb-3">布局预设</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-zinc-800/50 border-zinc-700"
                onClick={() => applyLayoutPreset("focus")}
              >
                <Layers className="h-4 w-4 mr-2" />
                专注模式
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-zinc-800/50 border-zinc-700"
                onClick={() => applyLayoutPreset("collaboration")}
              >
                <Users className="h-4 w-4 mr-2" />
                协作模式
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-zinc-800/50 border-zinc-700"
                onClick={() => applyLayoutPreset("research")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                研究模式
              </Button>
            </div>
          </Card>

          <Button
            variant="outline"
            className="w-full justify-center text-sm bg-zinc-800/50 border-zinc-700"
            onClick={() => applyLayoutPreset("default")}
          >
            恢复默认布局
          </Button>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
