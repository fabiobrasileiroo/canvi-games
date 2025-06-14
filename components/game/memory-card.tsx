"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
  const [showErrorAnimation, setShowErrorAnimation] = useState(false)

  // Controla quando mostrar a animação de erro
  useEffect(() => {
    if (isWrongPair) {
      const timer = setTimeout(() => {
        setShowErrorAnimation(true)
      }, 800) // Tempo para ver o símbolo antes de virar de volta
      return () => clearTimeout(timer)
    } else {
      setShowErrorAnimation(false)
    }
  }, [isWrongPair])

  return (
    <motion.div
      className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-lg cursor-pointer will-change-transform"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(showErrorAnimation && {
          x: [0, -4, 4, -4, 4, 0],
        }),
      }}
      transition={{
        type: "tween",
        duration: showErrorAnimation ? 0.5 : 0.25,
        delay: index * 0.02,
        ease: "easeOut",
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Container da carta que faz o flip */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateY: isFlipped && !showErrorAnimation ? 180 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Verso da carta (lado que mostra quando não está virada) */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg flex items-center justify-center",
            showErrorAnimation ? "bg-[#fe6536]" : "bg-[#a20d96]",
          )}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <motion.div
            animate={{
              opacity: showErrorAnimation ? 0 : 1,
              scale: showErrorAnimation ? 0.3 : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Image
              src="/assets/games/back-card.svg"
              width={110}
              height={110}
              alt="back-card"
              priority
              className="w-16 h-16 sm:w-[100px] sm:h-[100px] lg:w-[110px] lg:h-[110px]"
            />
          </motion.div>
        </div>

        {/* Frente da carta (lado que mostra quando está virada) */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg flex items-center justify-center",
            isMatched && "bg-[#9BCB3C]",
            isOpened && !isMatched && !showErrorAnimation && "bg-[#670c5f]",
            showErrorAnimation && "bg-[#fe6536]",
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: isFlipped ? 1 : 0,
              scale: isFlipped ? 1 : 0.3,
            }}
            transition={{
              delay: isFlipped ? 0.2 : 0,
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <Image
              src={`/assets/${symbol}`}
              alt={symbol}
              width={85}
              height={85}
              className="object-contain w-14 h-14 sm:w-[80px] sm:h-[80px] lg:w-[85px] lg:h-[85px]"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
