"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useModules } from "../context/module-context"

export type TaskbarPosition = "left" | "right" | "top" | "bottom"

export default function Taskbar() {
  const { minimizedModules, taskbarPosition } = useModules()
  const [showTaskbar, setShowTaskbar] = useState(false)

  // Only show taskbar when there are minimized modules
  useEffect(() => {
    setShowTaskbar(minimizedModules.length > 0)
  }, [minimizedModules])

  if (!showTaskbar) return null

  // Position-specific styles
  const positionStyles: Record<TaskbarPosition, string> = {
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
    top: "top-4 left-1/2 -translate-x-1/2 flex-row",
    bottom: "bottom-20 left-1/2 -translate-x-1/2 flex-row", // Positioned above multimodal input
  }

  // Animation variants based on position
  const animationVariants: Record<TaskbarPosition, { initial: any; animate: any; exit: any }> = {
    left: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    right: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    top: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    bottom: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  }

  // Tooltip placement based on position
  const tooltipSide: Record<TaskbarPosition, "right" | "left" | "bottom" | "top"> = {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top",
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed z-50 ${positionStyles[taskbarPosition]}`}
        initial={animationVariants[taskbarPosition].initial}
        animate={animationVariants[taskbarPosition].animate}
        exit={animationVariants[taskbarPosition].exit}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div
          className={cn(
            "bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-800 shadow-lg py-2 px-1.5",
            "flex items-center gap-2",
            taskbarPosition === "left" || taskbarPosition === "right" ? "flex-col" : "flex-row",
          )}
        >
          <TooltipProvider delayDuration={300}>
            {minimizedModules.map((module) => (
              <Tooltip key={module.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors",
                      "text-white", // 确保图标颜色为白色，适配暗色模式
                    )}
                    onClick={module.restore}
                  >
                    {/* 克隆图标并设置颜色 */}
                    {React.isValidElement(module.icon)
                      ? React.cloneElement(module.icon as React.ReactElement, {
                          className: cn(
                            (module.icon as React.ReactElement).props.className || "",
                            "text-white", // 确保图标颜色为白色
                          ),
                        })
                      : module.icon}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide[taskbarPosition]} className="bg-zinc-800 border-zinc-700 text-xs">
                  {module.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
