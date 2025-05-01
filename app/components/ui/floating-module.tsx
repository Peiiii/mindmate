"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useDragControls } from "framer-motion"
import { Maximize2, Minimize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useModules } from "@/app/context/module-context"

export interface FloatingModuleProps {
  id: string // 模块唯一ID
  title: string // 模块标题
  icon: React.ReactNode // 模块图标
  defaultPosition?: {
    // 默认位置
    x: number | string
    y: number | string
  }
  defaultSize?: {
    // 默认大小
    width: number | string
    height: number | string
  }
  expandedSize?: {
    // 展开时的大小
    width: number | string
    height: number | string
  }
  className?: string // 自定义类名
  headerClassName?: string // 标题栏自定义类名
  bodyClassName?: string // 内容区域自定义类名
  allowMinimize?: boolean // 是否允许最小化
  allowExpand?: boolean // 是否允许展开
  allowClose?: boolean // 是否允许关闭
  allowDrag?: boolean // 是否允许拖拽
  allowResize?: boolean // 是否允许调整大小
  zIndex?: number // z-index值
  onMinimize?: () => void // 最小化回调
  onExpand?: () => void // 展开回调
  onClose?: () => void // 关闭回调
  children: React.ReactNode // 模块内容
}

export function FloatingModule({
  id,
  title,
  icon,
  defaultPosition = { x: "auto", y: "auto" },
  defaultSize = { width: 300, height: 400 },
  expandedSize = { width: "calc(100% - 80px)", height: "calc(100% - 80px)" },
  className = "",
  headerClassName = "",
  bodyClassName = "",
  allowMinimize = true,
  allowExpand = true,
  allowClose = false,
  allowDrag = true,
  allowResize = false,
  zIndex = 10,
  onMinimize,
  onExpand,
  onClose,
  children,
}: FloatingModuleProps) {
  const [expanded, setExpanded] = useState(false)
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const moduleRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const { minimizeModule, restoreModule, isMinimized } = useModules()
  const minimized = isMinimized(id)

  // 处理拖拽开始
  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (allowDrag && !expanded) {
      dragControls.start(event)
    }
  }

  // 处理展开/收缩
  const handleExpand = () => {
    setExpanded(!expanded)
    if (onExpand) onExpand()
  }

  // 处理最小化
  const handleMinimize = () => {
    minimizeModule({
      id,
      name: title,
      icon,
      restore: () => restoreModule(id),
    })
    if (onMinimize) onMinimize()
  }

  // 处理关闭
  const handleClose = () => {
    if (onClose) onClose()
  }

  // 计算当前大小
  const currentSize = expanded ? expandedSize : size

  // 计算当前位置
  const currentPosition = expanded ? { x: 0, y: 0 } : position

  // 如果已最小化，不渲染内容
  if (minimized) {
    return null
  }

  return (
    <motion.div
      ref={moduleRef}
      className={cn(
        "fixed bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden",
        expanded ? "inset-10" : "",
        className,
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: currentSize.width,
        height: currentSize.height,
        left: expanded ? 40 : currentPosition.x,
        top: expanded ? 40 : currentPosition.y,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ zIndex }}
      drag={allowDrag && !expanded}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onDragEnd={(_, info) => {
        setPosition({
          x: info.point.x,
          y: info.point.y,
        })
      }}
    >
      {/* 模块标题栏 */}
      <div
        className={cn("p-3 border-b border-zinc-800 flex justify-between items-center cursor-move", headerClassName)}
        onPointerDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <div className="flex gap-1">
          {allowExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
              onClick={handleExpand}
            >
              {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          )}
          {allowMinimize && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
              onClick={handleMinimize}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          )}
          {allowClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* 模块内容区域 */}
      <div
        className={cn("overflow-auto", bodyClassName)}
        style={{
          height: `calc(100% - ${allowResize ? "53px" : "45px"})`,
        }}
      >
        {children}
      </div>

      {/* 调整大小控制点 */}
      {allowResize && !expanded && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-zinc-800/50 hover:bg-zinc-700/50 rounded-bl-lg" />
      )}
    </motion.div>
  )
}
