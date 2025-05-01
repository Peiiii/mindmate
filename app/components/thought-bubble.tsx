"use client"

import { motion, useMotionValue } from "framer-motion"
import { Brain } from "lucide-react"

interface ThoughtBubbleProps {
  thought: string
  position: {
    x: number
    y: number
  }
}

export function ThoughtBubble({ thought, position }: ThoughtBubbleProps) {
  // Use motion values for position
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      className="absolute"
      style={{ x, y }}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="bg-zinc-900/80 backdrop-blur-sm p-3 rounded-xl max-w-xs shadow-lg border border-zinc-800 flex items-start gap-2 cursor-move">
        <Brain className="h-4 w-4 text-primary mt-1 shrink-0" />
        <p className="text-sm text-zinc-300">{thought}</p>
      </div>
    </motion.div>
  )
}
