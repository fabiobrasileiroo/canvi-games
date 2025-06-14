"use client"

import { motion } from "framer-motion"
import { MemoryCard } from "./memory-card"

interface GameBoardProps {
  cards: string[]
  opened: number[]
  matched: number[]
  wrongPair: number[]
  onCardClick: (index: number) => void
}

export function GameBoard({ cards, opened, matched, wrongPair, onCardClick }: GameBoardProps) {
  return (
    <motion.div
      className="deck bg-[#f0f0f0] p-8 rounded-xl shadow-[8px_8px_0_0_#e7a9fc]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-4 gap-6 lg:gap-8">
        {cards.map((symbol, index) => (
          <MemoryCard
            key={`${symbol}-${index}`}
            symbol={symbol}
            index={index}
            isOpened={opened.includes(index)}
            isMatched={matched.includes(index)}
            isWrongPair={wrongPair.includes(index)}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    </motion.div>
  )
}
