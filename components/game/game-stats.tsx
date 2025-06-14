"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface GameStatsProps {
  moves: number
  rating: number
  timeDisplay: string
  matchedPairs: number
  onRestart: () => void
}

export function GameStats({ moves, rating, timeDisplay, matchedPairs, onRestart }: GameStatsProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="stars mr-4">
            {[0, 1, 2].map((star) => (
              <motion.i
                key={star}
                className={`fa ${rating > star ? "fa-star text-yellow-500" : "fa-star-o text-gray-400"} mr-1`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: star * 0.1 }}
              ></motion.i>
            ))}
          </div>
          <span className="moves font-medium">{moves}</span>
          <span>&nbsp; Movimentos</span>&nbsp;-&nbsp;
          <span className="font-medium">{matchedPairs}/8</span>&nbsp;Pares
        </div>

        <div className="flex items-center">
          <span id="timer" className="font-bold text-lg">
            {timeDisplay}
          </span>
          <Button variant="ghost" size="icon" className="ml-4" onClick={onRestart}>
            <i className="fa fa-repeat"></i>
          </Button>
        </div>
      </div>

      {/* <motion.div
        className="bg-muted p-3 rounded-md text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-2xl font-bold">{matchedPairs}</div>
        <div className="text-sm text-muted-foreground">Pares Encontrados</div>
      </motion.div> */}
    </>
  )
}
