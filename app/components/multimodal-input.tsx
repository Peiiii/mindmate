"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, ImageIcon, PenTool, Sparkles, X, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MultimodalInput() {
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleActivate = (input: string) => {
    setActiveInput(activeInput === input ? null : input)
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <motion.div
        className="bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-800 shadow-lg px-4 py-2 flex items-center gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${activeInput === "voice" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"}`}
          onClick={() => {
            handleActivate("voice")
            handleVoiceRecord()
          }}
        >
          <Mic className={`h-5 w-5 ${isRecording ? "text-red-500 animate-pulse" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${activeInput === "image" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"}`}
          onClick={() => handleActivate("image")}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${activeInput === "draw" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"}`}
          onClick={() => handleActivate("draw")}
        >
          <PenTool className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${activeInput === "scan" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"}`}
          onClick={() => handleActivate("scan")}
        >
          <Camera className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${activeInput === "file" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"}`}
          onClick={() => handleActivate("file")}
        >
          <FileText className="h-5 w-5" />
        </Button>

        <div className="h-6 w-px bg-zinc-800 mx-1"></div>

        <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
          <Sparkles className="h-5 w-5 text-primary" /> {/* 确保图标颜色为主题色 */}
        </Button>
      </motion.div>

      <AnimatePresence>
        {activeInput && (
          <motion.div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-4 w-80"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">
                {activeInput === "voice" && "语音记录"}
                {activeInput === "image" && "添加图片"}
                {activeInput === "draw" && "手绘笔记"}
                {activeInput === "scan" && "扫描文档"}
                {activeInput === "file" && "添加文件"}
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveInput(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {activeInput === "voice" && (
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${isRecording ? "bg-red-500/20" : "bg-zinc-800"}`}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? "text-red-500" : "text-zinc-400"}`} />
                </div>
                <p className="text-xs text-zinc-400">{isRecording ? "正在录音..." : "点击麦克风开始录音"}</p>
                {isRecording && (
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <motion.div
                      className="bg-red-500 h-1.5 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 10 }}
                    />
                  </div>
                )}
              </div>
            )}

            {activeInput === "image" && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-zinc-500" />
                  <p className="text-xs text-zinc-400 text-center">拖放图片或点击上传</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    从相册选择
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    拍摄照片
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
