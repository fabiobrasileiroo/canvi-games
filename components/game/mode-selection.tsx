"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"

type GameMode = "normal" | "duelo"

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
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
        className="relative z-10 flex justify-center mb-10 w-full max-w-[1000px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/assets/games/jogo-da-memoria.svg"
          width={500}
          height={150}
          alt="Jogo da memória"
          className="mb-8"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <Card className="p-10 mb-10 shadow-2xl max-w-[1000px] w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
          <h1 className="text-5xl font-bold text-center mb-10 text-white">Escolha o Modo de Jogo</h1>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-64 w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-green-600/80 hover:bg-green-700/90 backdrop-blur-sm text-white text-3xl rounded-xl border border-green-500/30 transition-all duration-300"
                onClick={() => onSelectMode("normal")}
              >
                <div className="flex flex-col items-center">
                  {/* <User size={100} className="mb-8" /> */}
                  <div className="">
                    <Image src={"/assets/user-01.svg"} className="mb-8" width={100} height={100} alt="user" />
                  </div>
                  <span>Modo Normal</span>
                  <span className="text-lg mt-4 opacity-90">Jogue sozinho</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-64 w-full sm:w-1/2">
              <Button
                className="h-full w-full bg-purple-600/80 hover:bg-purple-700/90 backdrop-blur-sm text-white text-3xl rounded-xl border border-purple-500/30 transition-all duration-300"
                onClick={() => onSelectMode("duelo")}
              >
                <div className="flex flex-col items-center">
                  {/* <Users size={100} className="mb-8" /> */}
                  <Image src={"/assets/user-02.svg"} className="mb-8" width={185} height={185} alt="user" />
                  <span>Modo Duelo</span>
                  <span className="text-lg mt-4 opacity-90">Jogue contra um amigo</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
