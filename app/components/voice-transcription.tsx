"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, PauseCircle, StopCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { withFloatingModule } from "./hoc/with-floating-module"
import { useModules } from "../context/module-context"

function VoiceTranscriptionContent() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState<string[]>([])
  const { toggleModuleVisibility } = useModules()

  // Simulate recording time
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, isPaused])

  // Simulate transcription
  useEffect(() => {
    if (isRecording && !isPaused) {
      const phrases = [
        "我认为这个设计需要更加注重用户体验。",
        "关键是要理解用户的核心需求是什么。",
        "我们应该考虑如何简化这个流程。",
        "这个功能应该更加直观易用。",
        "我们需要在下周之前完成这个原型。",
      ]

      const transcriptionInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          setTranscript((prev) => [...prev, phrases[Math.floor(Math.random() * phrases.length)]])
        }
      }, 3000)

      return () => clearInterval(transcriptionInterval)
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
  }

  const handleClearRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setTranscript([])
  }

  const handleClose = () => {
    toggleModuleVisibility("voice-transcription")
  }

  return (
    <div className="p-3">
      <div className="flex gap-2 mb-3">
        {!isRecording ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-zinc-800/50 border-zinc-700"
            onClick={handleStartRecording}
          >
            <Mic className="h-4 w-4 mr-2" />
            开始录音
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-zinc-800/50 border-zinc-700"
              onClick={handlePauseRecording}
            >
              {isPaused ? <Mic className="h-4 w-4 mr-2" /> : <PauseCircle className="h-4 w-4 mr-2" />}
              {isPaused ? "继续" : "暂停"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-zinc-800/50 border-zinc-700"
              onClick={handleStopRecording}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              停止
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800/50 border-zinc-700"
              onClick={handleClearRecording}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div
        className={`max-h-64 overflow-y-auto rounded-lg ${transcript.length > 0 ? "border border-zinc-800 p-3" : ""}`}
      >
        <AnimatePresence>
          {transcript.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 last:mb-0"
            >
              <p className="text-sm">{line}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {transcript.length === 0 && isRecording && (
          <div className="flex items-center justify-center h-16 text-zinc-500 text-sm">正在聆听...</div>
        )}

        {transcript.length === 0 && !isRecording && (
          <div className="flex items-center justify-center h-16 text-zinc-500 text-sm">
            点击"开始录音"来记录你的想法
          </div>
        )}
      </div>

      <div className="text-xs text-zinc-500 mt-3 text-right">{formatTime(recordingTime)}</div>
    </div>
  )
}

// 使用高阶组件将普通组件转换为浮动模块
const VoiceTranscription = withFloatingModule(VoiceTranscriptionContent, {
  id: "voice-transcription",
  title: "语音记录",
  icon: <Mic className="h-4 w-4 text-teal-400" />,
  moduleConfig: {
    defaultPosition: { x: "left", y: "top" },
    defaultSize: { width: 380, height: "auto" },
    allowClose: true, // 添加关闭功能
  },
})

export default VoiceTranscription
