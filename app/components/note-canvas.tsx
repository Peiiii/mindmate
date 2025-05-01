"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function NoteCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState([
    { id: 1, x: 200, y: 100, content: "核心想法", type: "primary" },
    { id: 2, x: 400, y: 200, content: "相关概念", type: "secondary" },
    { id: 3, x: 100, y: 300, content: "实施步骤", type: "action" },
  ])

  return (
    <div className="w-full h-full relative overflow-hidden" ref={canvasRef}>
      {/* Canvas background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ x: node.x, y: node.y }}
          animate={{ x: node.x, y: node.y }}
          drag
          dragConstraints={canvasRef}
          className="absolute"
        >
          <Card
            className={`p-3 shadow-lg cursor-move w-40 ${
              node.type === "primary"
                ? "bg-primary/20 border-primary/50"
                : node.type === "secondary"
                  ? "bg-blue-900/20 border-blue-800/50"
                  : "bg-amber-900/20 border-amber-800/50"
            }`}
          >
            {node.type === "primary" && (
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary">核心</span>
              </div>
            )}
            <p className="text-sm">{node.content}</p>
          </Card>
        </motion.div>
      ))}

      {/* Connection lines would be drawn here with SVG or Canvas */}
    </div>
  )
}
