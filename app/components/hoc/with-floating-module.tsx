"use client"

import type React from "react"
import { useEffect } from "react"
import { FloatingModule, type FloatingModuleProps } from "../ui/floating-module"
import { useModules } from "@/app/context/module-context"

export interface WithFloatingModuleProps {
  id: string
  title: string
  icon: React.ReactNode
  moduleConfig?: Partial<Omit<FloatingModuleProps, "id" | "title" | "icon" | "children">>
}

export function withFloatingModule<P extends object>(
  Component: React.ComponentType<P>,
  options: WithFloatingModuleProps,
) {
  const WithFloatingModuleComponent = (props: P) => {
    const { id, title, icon, moduleConfig = {} } = options
    const { registerModule, moduleStates, bringModuleToFront, updateModulePosition, updateModuleSize } = useModules()

    // 注册模块
    useEffect(() => {
      registerModule({
        id,
        title,
        icon,
        description: "",
        defaultVisible: true,
        ...moduleConfig,
      })
    }, [])

    // 如果模块状态不存在或不可见，则不渲染
    if (!moduleStates[id] || !moduleStates[id].visible) {
      return null
    }

    return (
      <FloatingModule
        id={id}
        title={title}
        icon={icon}
        defaultPosition={moduleStates[id].position}
        defaultSize={moduleStates[id].size}
        zIndex={moduleStates[id].zIndex}
        // onDragEnd={(position) => updateModulePosition(id, position)}
        // onResizeEnd={(size) => updateModuleSize(id, size)}
        // onClick={() => bringModuleToFront(id)}
        {...moduleConfig}
      >
        <Component {...props} />
      </FloatingModule>
    )
  }

  WithFloatingModuleComponent.displayName = `withFloatingModule(${Component.displayName || Component.name || "Component"})`
  return WithFloatingModuleComponent
}
