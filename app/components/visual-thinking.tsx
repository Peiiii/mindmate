"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  Pencil,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

type DrawingTool = "select" | "pen" | "eraser" | "rectangle" | "circle" | "arrow" | "text"
type DrawingColor = "primary" | "blue" | "green" | "amber" | "red" | "white"

interface DrawingElement {
  id: string
  type: DrawingTool
  points?: { x: number; y: number }[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  color: string
  width: number
  text?: string
}

export default function VisualThinking() {
  const [minimized, setMinimized] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeTool, setActiveTool] = useState<DrawingTool>("pen")
  const [activeColor, setActiveColor] = useState<DrawingColor>("primary")
  const [lineWidth, setLineWidth] = useState(2)
  const [zoom, setZoom] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [history, setHistory] = useState<DrawingElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentElementRef = useRef<DrawingElement | null>(null)

  // Colors mapping
  const colorMap = {
    primary: "rgb(168, 85, 247)",
    blue: "rgb(59, 130, 246)",
    green: "rgb(16, 185, 129)",
    amber: "rgb(245, 158, 11)",
    red: "rgb(239, 68, 68)",
    white: "rgb(255, 255, 255)",
  }

  // Initialize canvas
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

    // Draw all elements
    elements.forEach((element) => drawElement(ctx, element))
  }, [elements, zoom])

  // Draw a single element
  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.color
    ctx.lineWidth = element.width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    switch (element.type) {
      case "pen":
        if (!element.points || element.points.length < 2) return

        ctx.beginPath()
        ctx.moveTo(element.points[0].x, element.points[0].y)

        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y)
        }

        ctx.stroke()
        break

      case "eraser":
        if (!element.points || element.points.length < 2) return

        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.moveTo(element.points[0].x, element.points[0].y)

        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y)
        }

        ctx.stroke()
        ctx.globalCompositeOperation = "source-over"
        break

      case "rectangle":
        if (!element.start || !element.end) return

        ctx.beginPath()
        ctx.rect(element.start.x, element.start.y, element.end.x - element.start.x, element.end.y - element.start.y)
        ctx.stroke()
        break

      case "circle":
        if (!element.start || !element.end) return

        const centerX = (element.start.x + element.end.x) / 2
        const centerY = (element.start.y + element.end.y) / 2
        const radiusX = Math.abs(element.end.x - element.start.x) / 2
        const radiusY = Math.abs(element.end.y - element.start.y) / 2

        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        ctx.stroke()
        break

      case "arrow":
        if (!element.start || !element.end) return

        // Draw line
        ctx.beginPath()
        ctx.moveTo(element.start.x, element.start.y)
        ctx.lineTo(element.end.x, element.end.y)
        ctx.stroke()

        // Draw arrowhead
        const angle = Math.atan2(element.end.y - element.start.y, element.end.x - element.start.x)
        const headLength = 15

        ctx.beginPath()
        ctx.moveTo(element.end.x, element.end.y)
        ctx.lineTo(
          element.end.x - headLength * Math.cos(angle - Math.PI / 6),
          element.end.y - headLength * Math.sin(angle - Math.PI / 6),
        )
        ctx.moveTo(element.end.x, element.end.y)
        ctx.lineTo(
          element.end.x - headLength * Math.cos(angle + Math.PI / 6),
          element.end.y - headLength * Math.sin(angle + Math.PI / 6),
        )
        ctx.stroke()
        break

      case "text":
        if (!element.start || !element.text) return

        ctx.font = `${element.width * 8}px sans-serif`
        ctx.fillStyle = element.color
        ctx.fillText(element.text, element.start.x, element.start.y)
        break
    }
  }

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    setIsDrawing(true)

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: activeTool,
      color: colorMap[activeColor],
      width: lineWidth,
    }

    switch (activeTool) {
      case "pen":
      case "eraser":
        newElement.points = [{ x, y }]
        break

      case "rectangle":
      case "circle":
      case "arrow":
      case "text":
        newElement.start = { x, y }
        newElement.end = { x, y }

        if (activeTool === "text") {
          const text = prompt("Enter text:")
          if (!text) return
          newElement.text = text
        }
        break
    }

    currentElementRef.current = newElement
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !currentElementRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const currentElement = { ...currentElementRef.current }

    switch (currentElement.type) {
      case "pen":
      case "eraser":
        currentElement.points = [...(currentElement.points || []), { x, y }]
        break

      case "rectangle":
      case "circle":
      case "arrow":
        currentElement.end = { x, y }
        break
    }

    currentElementRef.current = currentElement

    // Redraw canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    elements.forEach((element) => drawElement(ctx, element))
    drawElement(ctx, currentElement)
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing || !currentElementRef.current) return

    setIsDrawing(false)

    // Add current element to elements
    const newElements = [...elements, currentElementRef.current]
    setElements(newElements)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    currentElementRef.current = null
  }

  // Handle undo
  const handleUndo = () => {
    if (historyIndex <= 0) {
      setElements([])
      setHistoryIndex(-1)
      return
    }

    setHistoryIndex(historyIndex - 1)
    setElements(history[historyIndex - 1])
  }

  // Handle redo
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return

    setHistoryIndex(historyIndex + 1)
    setElements(history[historyIndex + 1])
  }

  // Handle clear
  const handleClear = () => {
    setElements([])
    setHistory([])
    setHistoryIndex(-1)
  }

  return (
    <motion.div
      className={`fixed ${
        minimized ? "right-6 bottom-6 w-10 h-10" : expanded ? "inset-10" : "right-6 bottom-6 w-[500px] h-[400px]"
      } bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      {minimized ? (
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => setMinimized(false)}
        >
          <Pencil className="h-4 w-4 text-primary" />
        </div>
      ) : (
        <>
          <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">视觉思考</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-zinc-800/50 hover:bg-zinc-700/50"
                onClick={() => setMinimized(true)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="p-2 border-b border-zinc-800 flex justify-between">
            <div className="flex gap-1">
              <Button
                variant={activeTool === "select" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "select" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("select")}
              >
                <Move className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={activeTool === "pen" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "pen" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("pen")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={activeTool === "eraser" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "eraser" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("eraser")}
              >
                <Eraser className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={activeTool === "rectangle" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "rectangle" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("rectangle")}
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={activeTool === "circle" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "circle" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("circle")}
              >
                <Circle className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={activeTool === "arrow" ? "default" : "ghost"}
                size="icon"
                className={`h-7 w-7 ${activeTool !== "arrow" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                onClick={() => setActiveTool("arrow")}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
                onClick={handleUndo}
                disabled={historyIndex < 0}
              >
                <Undo className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="p-2 border-b border-zinc-800">
            <Tabs defaultValue="color" className="w-full">
              <TabsList className="w-full h-7 bg-zinc-800/50">
                <TabsTrigger value="color" className="text-xs h-5">
                  颜色
                </TabsTrigger>
                <TabsTrigger value="width" className="text-xs h-5">
                  线宽
                </TabsTrigger>
                <TabsTrigger value="zoom" className="text-xs h-5">
                  缩放
                </TabsTrigger>
              </TabsList>

              <TabsContent value="color" className="pt-2 flex gap-1">
                <Button
                  variant={activeColor === "primary" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "primary" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("primary")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-primary" />
                </Button>
                <Button
                  variant={activeColor === "blue" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "blue" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("blue")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-blue-500" />
                </Button>
                <Button
                  variant={activeColor === "green" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "green" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("green")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-green-500" />
                </Button>
                <Button
                  variant={activeColor === "amber" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "amber" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("amber")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                </Button>
                <Button
                  variant={activeColor === "red" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "red" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("red")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-red-500" />
                </Button>
                <Button
                  variant={activeColor === "white" ? "default" : "ghost"}
                  size="icon"
                  className={`h-7 w-7 ${activeColor !== "white" ? "bg-zinc-800/50 hover:bg-zinc-700/50" : ""}`}
                  onClick={() => setActiveColor("white")}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-white" />
                </Button>
              </TabsContent>

              <TabsContent value="width" className="pt-2">
                <div className="px-2">
                  <Slider
                    value={[lineWidth]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setLineWidth(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-zinc-500">细</span>
                    <span className="text-xs text-zinc-500">粗</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="zoom" className="pt-2">
                <div className="px-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <Slider
                      value={[zoom * 100]}
                      min={50}
                      max={200}
                      step={10}
                      onValueChange={(value) => setZoom(value[0] / 100)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-zinc-800/50 hover:bg-zinc-700/50"
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex justify-center mt-1">
                    <Badge variant="outline" className="text-[10px] h-5 bg-zinc-800/50 border-zinc-700">
                      {Math.round(zoom * 100)}%
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div
            className="flex-1 overflow-hidden"
            style={{ height: expanded ? "calc(100% - 142px)" : "calc(100% - 142px)" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full bg-zinc-950"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </>
      )}
    </motion.div>
  )
}
