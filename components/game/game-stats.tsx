"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

interface GameStatsProps {
  moves: number
  rating: number
  timeDisplay: string
  matchedPairs: number
  gameActive: boolean
  autoStart: boolean
  onRestart: () => void
  onPlay: () => void
}

export function GameStats({
  moves,
  rating,
  timeDisplay,
  matchedPairs,
  gameActive,
  autoStart,
  onRestart,
  onPlay,
}: GameStatsProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="stars mr-6">
            {[0, 1, 2].map((star) => (
              <motion.i
                key={star}
                className={`fa ${rating > star ? "fa-star text-yellow-500" : "fa-star-o text-gray-400"} mr-2 text-2xl`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: star * 0.1 }}
              ></motion.i>
            ))}
          </div>
          <span className="moves font-medium text-2xl">{moves}</span>
          <span className="text-2xl">&nbsp; Movimentos</span>&nbsp;-&nbsp;
          <span className="font-medium text-2xl">{matchedPairs}/8</span>&nbsp;<span className="text-2xl">Pares</span>
        </div>

        <div className="flex items-center gap-4">
          <span id="timer" className="font-bold text-3xl">
            {timeDisplay}
          </span>

          {!gameActive && !autoStart && (
            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 bg-green-600 hover:bg-green-700"
              onClick={onPlay}
              title="Iniciar Jogo"
            >
              <Play size={24} />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-14 w-14" onClick={onRestart} title="Reiniciar">
            <RotateCcw size={24} />
          </Button>
        </div>
      </div>
    </>
  )
}
