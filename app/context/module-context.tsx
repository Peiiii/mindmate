"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { TaskbarPosition } from "../components/taskbar"

export interface MinimizedModule {
  id: string
  name: string
  icon: React.ReactNode
  restore: () => void
}

export interface ModuleConfig {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  defaultVisible: boolean
  defaultPosition?: {
    x: number | string
    y: number | string
  }
  defaultSize?: {
    width: number | string
    height: number | string
  }
  allowMinimize?: boolean
  allowExpand?: boolean
  allowClose?: boolean
  allowDrag?: boolean
  allowResize?: boolean
  zIndex?: number
}

interface ModuleState {
  visible: boolean
  minimized: boolean
  position: {
    x: number | string
    y: number | string
  }
  size: {
    width: number | string
    height: number | string
  }
  zIndex: number
}

interface ModuleContextType {
  // 模块状态管理
  moduleStates: Record<string, ModuleState>
  moduleConfigs: Record<string, ModuleConfig>
  registerModule: (config: ModuleConfig) => void
  unregisterModule: (id: string) => void
  setModuleVisibility: (id: string, visible: boolean) => void
  toggleModuleVisibility: (id: string) => void
  updateModulePosition: (id: string, position: { x: number | string; y: number | string }) => void
  updateModuleSize: (id: string, size: { width: number | string; height: number | string }) => void
  bringModuleToFront: (id: string) => void

  // 最小化模块管理
  minimizedModules: MinimizedModule[]
  minimizeModule: (module: MinimizedModule) => void
  restoreModule: (id: string) => void
  isMinimized: (id: string) => boolean

  // 任务栏配置
  taskbarPosition: TaskbarPosition
  setTaskbarPosition: (position: TaskbarPosition) => void

  // 布局预设
  applyLayoutPreset: (preset: "focus" | "collaboration" | "research" | "default") => void
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined)

// 默认的模块配置
const DEFAULT_MODULE_CONFIGS: Record<string, ModuleConfig> = {
  "knowledge-graph": {
    id: "knowledge-graph",
    title: "知识图谱",
    icon: null, // 将在组件中设置
    description: "可视化展示知识点之间的关联",
    defaultVisible: true,
    defaultPosition: { x: "left", y: "bottom" },
    defaultSize: { width: 320, height: 320 },
    zIndex: 10,
  },
  "context-awareness": {
    id: "context-awareness",
    title: "环境感知",
    icon: null,
    description: "显示当前环境和上下文信息",
    defaultVisible: true,
    defaultPosition: { x: "right", y: "top" },
    defaultSize: { width: 280, height: "auto" },
    zIndex: 10,
  },
  "time-memory": {
    id: "time-memory",
    title: "时间记忆",
    icon: null,
    description: "时间轴上的笔记和思考",
    defaultVisible: true,
    defaultPosition: { x: "right", y: "bottom" },
    defaultSize: { width: 320, height: 400 },
    zIndex: 10,
  },
  "collaborative-space": {
    id: "collaborative-space",
    title: "协作空间",
    icon: null,
    description: "与他人共享和协作",
    defaultVisible: true,
    defaultPosition: { x: "right", y: "top" },
    defaultSize: { width: 320, height: 400 },
    zIndex: 11,
  },
  "ai-insights": {
    id: "ai-insights",
    title: "AI 洞察",
    icon: null,
    description: "AI 生成的见解和建议",
    defaultVisible: true,
    defaultPosition: { x: "left", y: "top" },
    defaultSize: { width: 320, height: 400 },
    zIndex: 10,
  },
  "external-knowledge": {
    id: "external-knowledge",
    title: "外部知识",
    icon: null,
    description: "连接外部知识源",
    defaultVisible: true,
    defaultPosition: { x: "left", y: "bottom" },
    defaultSize: { width: 320, height: 400 },
    zIndex: 10,
  },
  "voice-transcription": {
    id: "voice-transcription",
    title: "语音转录",
    icon: null,
    description: "语音记录和转录",
    defaultVisible: false,
    defaultPosition: { x: "left", y: "top" },
    defaultSize: { width: 380, height: "auto" },
    zIndex: 10,
  },
  "chat-agent": {
    id: "chat-agent",
    title: "思维伙伴 (MindMate)",
    icon: null,
    description: "与AI助手进行对话交流",
    defaultVisible: true,
    defaultPosition: { x: "right", y: "center" },
    defaultSize: { width: 360, height: 480 },
    zIndex: 15,
  },
}

// 布局预设
const LAYOUT_PRESETS = {
  default: {
    visibleModules: [
      "knowledge-graph",
      "context-awareness",
      "time-memory",
      "collaborative-space",
      "ai-insights",
      "external-knowledge",
      "chat-agent", // 添加聊天Agent
    ],
    positions: {},
  },
  focus: {
    visibleModules: ["knowledge-graph", "ai-insights"],
    positions: {
      "knowledge-graph": { x: "right", y: "bottom" },
      "ai-insights": { x: "right", y: "top" },
    },
  },
  collaboration: {
    visibleModules: ["collaborative-space", "knowledge-graph", "external-knowledge"],
    positions: {},
  },
  research: {
    visibleModules: ["knowledge-graph", "external-knowledge", "time-memory", "ai-insights"],
    positions: {},
  },
}

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [moduleConfigs, setModuleConfigs] = useState<Record<string, ModuleConfig>>(DEFAULT_MODULE_CONFIGS)
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleState>>({})
  const [minimizedModules, setMinimizedModules] = useState<MinimizedModule[]>([])
  const [taskbarPosition, setTaskbarPosition] = useState<TaskbarPosition>("left")
  const [nextZIndex, setNextZIndex] = useState(100)

  // 初始化模块状态
  useEffect(() => {
    const initialStates: Record<string, ModuleState> = {}

    Object.values(moduleConfigs).forEach((config) => {
      initialStates[config.id] = {
        visible: config.defaultVisible,
        minimized: false,
        position: config.defaultPosition || { x: 0, y: 0 },
        size: config.defaultSize || { width: 300, height: 400 },
        zIndex: config.zIndex || 10,
      }
    })

    setModuleStates(initialStates)
  }, [])

  // 注册模块
  const registerModule = useCallback((config: ModuleConfig) => {
    setModuleConfigs((prev) => ({
      ...prev,
      [config.id]: config,
    }))

    setModuleStates((prev) => {
      if (prev[config.id]) return prev

      return {
        ...prev,
        [config.id]: {
          visible: config.defaultVisible,
          minimized: false,
          position: config.defaultPosition || { x: 0, y: 0 },
          size: config.defaultSize || { width: 300, height: 400 },
          zIndex: config.zIndex || 10,
        },
      }
    })
  }, [])

  // 注销模块
  const unregisterModule = useCallback((id: string) => {
    setModuleConfigs((prev) => {
      const newConfigs = { ...prev }
      delete newConfigs[id]
      return newConfigs
    })

    setModuleStates((prev) => {
      const newStates = { ...prev }
      delete newStates[id]
      return newStates
    })

    setMinimizedModules((prev) => prev.filter((module) => module.id !== id))
  }, [])

  // 设置模块可见性
  const setModuleVisibility = useCallback((id: string, visible: boolean) => {
    setModuleStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible,
      },
    }))
  }, [])

  // 切换模块可见性
  const toggleModuleVisibility = useCallback((id: string) => {
    setModuleStates((prev) => {
      if (!prev[id]) return prev

      return {
        ...prev,
        [id]: {
          ...prev[id],
          visible: !prev[id].visible,
        },
      }
    })
  }, [])

  // 更新模块位置
  const updateModulePosition = useCallback((id: string, position: { x: number | string; y: number | string }) => {
    setModuleStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }))
  }, [])

  // 更新模块大小
  const updateModuleSize = useCallback((id: string, size: { width: number | string; height: number | string }) => {
    setModuleStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }))
  }, [])

  // 将模块置于顶层
  const bringModuleToFront = useCallback(
    (id: string) => {
      setNextZIndex((prev) => prev + 1)

      setModuleStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          zIndex: nextZIndex,
        },
      }))
    },
    [nextZIndex],
  )

  // 最小化模块
  const minimizeModule = useCallback((module: MinimizedModule) => {
    setMinimizedModules((prev) => [...prev.filter((m) => m.id !== module.id), module])

    setModuleStates((prev) => ({
      ...prev,
      [module.id]: {
        ...prev[module.id],
        minimized: true,
      },
    }))
  }, [])

  // 恢复模块
  const restoreModule = useCallback(
    (id: string) => {
      setMinimizedModules((prev) => prev.filter((module) => module.id !== id))

      setModuleStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          minimized: false,
        },
      }))

      // 将恢复的模块置于顶层
      bringModuleToFront(id)
    },
    [bringModuleToFront],
  )

  // 检查模块是否最小化
  const isMinimized = useCallback(
    (id: string) => {
      return moduleStates[id]?.minimized || false
    },
    [moduleStates],
  )

  // 应用布局预设
  const applyLayoutPreset = useCallback((preset: "focus" | "collaboration" | "research" | "default") => {
    const presetConfig = LAYOUT_PRESETS[preset]

    // 更新模块可见性
    setModuleStates((prev) => {
      const newStates = { ...prev }

      Object.keys(newStates).forEach((id) => {
        newStates[id] = {
          ...newStates[id],
          visible: presetConfig.visibleModules.includes(id),
        }
      })

      // 更新位置（如果预设中有指定）
      Object.entries(presetConfig.positions).forEach(([id, position]) => {
        if (newStates[id]) {
          newStates[id] = {
            ...newStates[id],
            position,
          }
        }
      })

      return newStates
    })

    // 恢复所有最小化的模块
    setMinimizedModules([])
    setModuleStates((prev) => {
      const newStates = { ...prev }

      Object.keys(newStates).forEach((id) => {
        newStates[id] = {
          ...newStates[id],
          minimized: false,
        }
      })

      return newStates
    })
  }, [])

  return (
    <ModuleContext.Provider
      value={{
        moduleStates,
        moduleConfigs,
        registerModule,
        unregisterModule,
        setModuleVisibility,
        toggleModuleVisibility,
        updateModulePosition,
        updateModuleSize,
        bringModuleToFront,
        minimizedModules,
        minimizeModule,
        restoreModule,
        isMinimized,
        taskbarPosition,
        setTaskbarPosition,
        applyLayoutPreset,
      }}
    >
      {children}
    </ModuleContext.Provider>
  )
}

export function useModules() {
  const context = useContext(ModuleContext)
  if (context === undefined) {
    throw new Error("useModules must be used within a ModuleProvider")
  }
  return context
}
