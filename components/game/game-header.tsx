"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trophy, Music, Music2, Volume2, VolumeX, Settings, Home } from "lucide-react"

type TeamType = "garantido" | "caprichoso" | null
type GameMode = "normal" | "duelo"
type ActiveTab = "game" | "settings" | "ranking"

interface GameHeaderProps {
  gameMode: GameMode
  currentDuelPlayer: number
  selectedTeam: TeamType
  activeTab: ActiveTab
  musicEnabled: boolean
  soundEnabled: boolean
  onTabChange: (tab: ActiveTab) => void
  onToggleMusic: () => void
  onToggleSound: () => void
}

export function GameHeader({
  gameMode,
  currentDuelPlayer,
  selectedTeam,
  activeTab,
  musicEnabled,
  soundEnabled,
  onTabChange,
  onToggleMusic,
  onToggleSound,
}: GameHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{gameMode === "duelo" ? `Jogador ${currentDuelPlayer + 1}` : "Jogador: "}</h1>
        <div className="flex items-center">
          {selectedTeam && (
            <Image
              src={
                selectedTeam === "garantido" ? "/assets/boi-vermelho-garantido.svg" : "/assets/boi-azul-caprichoso.svg"
              }
              alt={selectedTeam === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
              width={75}
              height={75}
              className=""
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("game")}
          className={cn("transition-colors", activeTab === "game" ? "bg-muted" : "")}
          title="Jogo"
        >
          <Home size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("settings")}
          className={cn("transition-colors", activeTab === "settings" ? "bg-muted" : "")}
          title="Configurações"
        >
          <Settings size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("ranking")}
          className={cn("transition-colors", activeTab === "ranking" ? "bg-muted" : "")}
          title="Ranking"
        >
          <Trophy size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMusic}
          className="transition-colors"
          title={musicEnabled ? "Desativar música" : "Ativar música"}
        >
          {musicEnabled ? <Music2 size={20} /> : <Music size={20} className="text-muted-foreground" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className="transition-colors"
          title={soundEnabled ? "Desativar sons" : "Ativar sons"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-muted-foreground" />}
        </Button>
      </div>
    </div>
  )
}
