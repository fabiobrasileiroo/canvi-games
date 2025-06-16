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
        className="relative z-10 flex justify-center mb-8 w-full max-w-[800px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/assets/games/jogo-da-memoria.svg"
          width={400}
          height={120}
          alt="Jogo da memória"
          className="mb-6"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <Card className="p-8 mb-8 shadow-2xl max-w-[800px] w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            {gameMode === "duelo" ? `Jogador ${currentDuelPlayer + 1}: Escolha seu Boi` : "Escolha seu Boi"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-[420px] w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-red-600/20 hover:bg-red-600/40 backdrop-blur-lg rounded-xl p-8 border border-red-500/30 transition-all duration-300 text-white text-2xl"
                onClick={() => onSelectTeam("garantido")}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/boi-vermelho-garantido.svg"
                    alt="Boi Garantido"
                    width={250}
                    height={250}
                    className="mb-4"
                  />
                  <span className="font-bold">Boi Garantido</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-[420px] w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30 transition-all duration-300 text-white text-2xl"
                onClick={() => onSelectTeam("caprichoso")}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/boi-azul-caprichoso.svg"
                    alt="Boi Caprichoso"
                    width={215}
                    height={215}
                    className="mb-4"
                  />
                  <span className="font-bold">Boi Caprichoso</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="flex justify-center gap-8 mt-6 w-full max-w-[800px] relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-lg flex flex-col items-center gap-2">
          <h2 className="bg-white px-4 py-2 rounded-lg font-bold shadow-md text-lg">Patrocínio Oficial</h2>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-md">
              <Image src="/assets/sponsorship/logo-zaplus.png" width={90} height={90} alt="Zaplus" />
              <Image src="/assets/qr-zaplus-car.png" alt="QR Zaplus" width={100} height={100} />
            </div>
            <p className="bg-white px-2 py-1 rounded-lg text-center shadow-md text-sm">Siga a gente no instagram</p>
          </div>
        </div>
      </motion.div>
    {/* </motion.div> */}
    </div >
  )
}
