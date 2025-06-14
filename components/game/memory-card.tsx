"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MemoryCardProps {
  symbol: string
  index: number
  isOpened: boolean
  isMatched: boolean
  isWrongPair: boolean
  onClick: () => void
}

export function MemoryCard({ symbol, index, isOpened, isMatched, isWrongPair, onClick }: MemoryCardProps) {
  const isFlipped = isOpened || isMatched

  return (
    <motion.div
      className={cn(
        "card relative h-16 w-16 sm:h-24 sm:w-24 rounded-lg cursor-pointer will-change-transform",
        isMatched && "bg-[#9BCB3C]",
        isOpened && !isMatched && "bg-[#670c5f]",
        isWrongPair && "bg-[#fe6536]",
        !isOpened && !isMatched && !isWrongPair && "bg-[#a20d96]",
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateY: 180
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: isFlipped ? 0 : 180,
        ...(isWrongPair && {
          x: [0, -5, 5, -5, 5, 0], // Reduzido de 10 para 5
        }),
      }}
      transition={{
        type: "tween", // Mais performático que spring
        duration: isWrongPair ? 0.3 : 0.25, // Reduzido
        delay: index * 0.02, // Reduzido de 0.05
        ease: "easeOut"
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Verso da carta */}
      <div
        className="absolute inset-0 rounded-lg bg-[#a20d96] flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <Image 
          src="/assets/games/back-card.svg" 
          width={75} 
          height={75} 
          alt="back-card"
          priority
        />
      </div>

      {/* Frente da carta */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {isFlipped && (
          <Image
            src={`/assets/${symbol}`}
            alt={symbol}
            width={50}
            height={50}
            className="object-contain sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]"
            priority
          />
        )}
      </div>
    </motion.div>
  )
}