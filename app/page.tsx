"use client";
import React from "react";
import Image from "next/image";
import { Brain, DollarSign, RotateCw, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Game {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  external?: boolean; // para identificar links externos
}

const GameRedirectPage: React.FC = () => {
  const games: Game[] = [
    {
      id: "memory",
      title: "Jogo da Memória",
      description: "Teste sua memória e concentração",
      icon: Brain,
      image: "/assets/games/jogo-da-memoria.svg",
      link: "/memory-game",
      color: "from-red-500 to-blue-500",
    },
    {
      id: "slots",
      title: "Caça Níquel",
      description: "Gire e tente a sorte nos slots",
      icon: DollarSign,
      link: "https://slot-machine-tau-woad.vercel.app/",
      image: "/assets/games/caca-niquel.svg",
      color: "from-red-500 to-blue-500",
      external: true, // abre em nova aba
    },
    // {
    //   id: "roulette",
    //   title: "Roleta",
    //   description: "A emoção do cassino clássico",
    //   icon: RotateCw,
    //   link: "#",
    //   color: "from-red-500 to-blue-500",
    // },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
      style={{
        backgroundImage: "url('/background.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center justify-center">
          <Image
            src="/assets/games/canvi-cassino.svg"
            width={300}
            height={92}
            alt="canvi cassino"
            className="mb-4"
          />
          <p className="text-lg text-gray-300">Escolha sua aventura</p>
        </div>

        {/* Cards dos Jogos */}
        <div className="grid md:grid-cols-2 gap-6 h-5xl w-6xl mx-auto">
          {games.map((game) => {
            const IconComponent = game.icon;

            return (
              <Link
                key={game.id}
                href={game.link}
                {...(game.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col gap-8 justify-center items-center">
                  {/* Ícone ou Imagem */}
                  {/* <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${game.color} mb-4`}
                  > */}
                  {game.image ? (
                    < Image
                      src={game.image}
                      alt={game.title}
                      width={game.title !== "Jogo da Memória" ? 350 : 460}
                      height={400}
                      className="rounded"
                    />
                  ) : (
                    <IconComponent className="w-6 h-6 text-white" />
                  )}
                  {/* </div> */}

                  {/* Conteúdo */}
                  {/* <h3 className="text-xl font-bold text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm">{game.description}</p> */}

                  {/* Botão */}
                  <button
                    className={`w-full py-3 rounded-lg bg-gradient-to-r ${game.color} text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                  >
                    <Play className="w-4 h-4" />
                    Jogar
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Card de Parceiros - Centralizado */}
        <div className="flex justify-center items-center mt-8 w-full">
          <motion.div
            className="flex justify-center items-center max-w-[800px] relative z-10"
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
        </div>
      </div>
    </div>
  );
};

export default GameRedirectPage;