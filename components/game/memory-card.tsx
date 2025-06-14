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
      // Delay para mostrar a carta primeiro, depois o erro
      const timer = setTimeout(() => {
        setShowErrorAnimation(true)
      }, 800) // Tempo para ver o símbolo antes do efeito de erro

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
        // Animação de tremor mais suave quando erro
        ...(showErrorAnimation && {
          x: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0],
          transition: {
            duration: 0.6,
            ease: "easeInOut",
          },
        }),
      }}
      transition={{
        type: "tween",
        duration: 0.25,
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
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Verso da carta (lado que mostra quando não está virada) */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg flex items-center justify-center transition-colors duration-300",
            showErrorAnimation ? "bg-[#fe6536]" : "bg-[#a20d96]",
          )}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <motion.div
            animate={{
              opacity: showErrorAnimation ? 0.3 : 1,
              scale: showErrorAnimation ? 0.8 : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Image
              src="/assets/games/back-card.svg"
              width={100}
              height={100}
              alt="back-card"
              priority
              draggable="false"
            />
          </motion.div>
        </div>

        {/* Frente da carta (lado que mostra quando está virada) */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg flex items-center justify-center transition-colors duration-300",
            isMatched && "bg-[#4eea68]",
            isOpened && !isMatched && !showErrorAnimation && "bg-[#670c5f]",
            isOpened && !isMatched && showErrorAnimation && "bg-[#fe6536]",
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
              delay: isFlipped ? 0.15 : 0,
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            <Image
              src={
                symbol === "cracha-pix.svg"
                  ? `/assets/${symbol.replace("cracha-pix.svg", "cracha-pix.png")}`
                  : `/assets/${symbol}`
              }
              alt={symbol}
              width={100}
              height={100}
              draggable="false"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
