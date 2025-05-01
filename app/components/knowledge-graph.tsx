"use client"

import { useRef, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { withFloatingModule } from "./hoc/with-floating-module"

interface Node {
  id: string
  label: string
  type: string
  x: number
  y: number
  size: number
}

interface Edge {
  source: string
  target: string
  label?: string
}

function KnowledgeGraphContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample data
  const nodes: Node[] = [
    { id: "1", label: "AI笔记", type: "core", x: 400, y: 300, size: 20 },
    { id: "2", label: "用户体验", type: "concept", x: 300, y: 200, size: 15 },
    { id: "3", label: "多模态输入", type: "feature", x: 500, y: 200, size: 12 },
    { id: "4", label: "思维可视化", type: "feature", x: 600, y: 300, size: 12 },
    { id: "5", label: "情境感知", type: "feature", x: 500, y: 400, size: 12 },
    { id: "6", label: "知识管理", type: "concept", x: 300, y: 400, size: 15 },
    { id: "7", label: "语音识别", type: "technology", x: 200, y: 250, size: 10 },
    { id: "8", label: "自然语言处理", type: "technology", x: 200, y: 350, size: 10 },
  ]

  const edges: Edge[] = [
    { source: "1", target: "2" },
    { source: "1", target: "3" },
    { source: "1", target: "4" },
    { source: "1", target: "5" },
    { source: "1", target: "6" },
    { source: "2", target: "3" },
    { source: "2", target: "7" },
    { source: "6", target: "8" },
    { source: "3", target: "7" },
    { source: "6", target: "4" },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source)
      const target = nodes.find((n) => n.id === edge.target)

      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)

      // Different colors for different node types
      if (node.type === "core") {
        ctx.fillStyle = "rgba(168, 85, 247, 0.8)"
      } else if (node.type === "concept") {
        ctx.fillStyle = "rgba(59, 130, 246, 0.6)"
      } else if (node.type === "feature") {
        ctx.fillStyle = "rgba(16, 185, 129, 0.6)"
      } else {
        ctx.fillStyle = "rgba(249, 115, 22, 0.6)"
      }

      ctx.fill()

      // Draw node label
      ctx.font = "10px sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.textAlign = "center"
      ctx.fillText(node.label, node.x, node.y + node.size + 12)
    })
  }, [])

  return (
    <div className="p-3">
      <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: "none" }} />
    </div>
  )
}

// 使用高阶组件将普通组件转换为浮动模块
const KnowledgeGraph = withFloatingModule(KnowledgeGraphContent, {
  id: "knowledge-graph",
  title: "知识图谱",
  icon: <Sparkles className="h-4 w-4 text-primary" />,
  moduleConfig: {
    defaultPosition: { x: "left", y: "bottom" },
    defaultSize: { width: 320, height: 320 },
    allowResize: true,
  },
})

export default KnowledgeGraph
