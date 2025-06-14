"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type TeamType = "garantido" | "caprichoso"
type GameMode = "normal" | "duelo"

interface TeamSelectionProps {
  gameMode: GameMode
  currentDuelPlayer: number
  onSelectTeam: (team: TeamType) => void
}

export function TeamSelection({ gameMode, currentDuelPlayer, onSelectTeam }: TeamSelectionProps) {
  return (
    <div
      className="flex justify-center items-center flex-col min-h-screen p-4 relative"
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Logo */}
      <motion.div
        className="relative z-10 flex justify-center mb-6 w-full max-w-[600px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="/assets/games/jogo-da-memoria.svg" width={300} height={92} alt="Jogo da memória" className="mb-4" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <Card className="p-6 mb-6 shadow-2xl max-w-[600px] w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            {gameMode === "duelo" ? `Jogador ${currentDuelPlayer + 1}: Escolha seu Boi` : "Escolha seu Boi"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-96 w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-red-600/20 hover:bg-red-600/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/30 transition-all duration-300 text-white text-xl"
                onClick={() => onSelectTeam("garantido")}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/boi-vermelho-garantido.svg"
                    alt="Boi Garantido"
                    width={200}
                    height={200}
                    className="mb-2"
                  />
                  <span className="font-bold">Boi Garantido</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-96 w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 transition-all duration-300 text-white text-xl"
                onClick={() => onSelectTeam("caprichoso")}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/boi-azul-caprichoso.svg"
                    alt="Boi Caprichoso"
                    width={200}
                    height={200}
                    className="mb-2"
                  />
                  <span className="font-bold">Boi Caprichoso</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
