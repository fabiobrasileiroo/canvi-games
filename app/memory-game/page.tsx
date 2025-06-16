"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

// Componentes modulares
import { ModeSelection } from "@/components/game/mode-selection"
import { TeamSelection } from "@/components/game/team-selection"
import { GameHeader } from "@/components/game/game-header"
import { GameStats } from "@/components/game/game-stats"
import { GameBoard } from "@/components/game/game-board"

const symbols = [
  "caboclo.svg",
  "caboclo.svg",
  "canvi.svg",
  "canvi.svg",
  "coracao.svg",
  "coracao.svg",
  "cracha-pix.svg",
  "cracha-pix.svg",
  "dr-guarana.svg",
  "dr-guarana.svg",
  "estrela.svg",
  "estrela.svg",
  "santa-claudia.svg",
  "santa-claudia.svg",
  "zaplus.svg",
  "zaplus.svg",
]

type Difficulty = "easy" | "medium" | "hard"
type TimerMode = "countdown" | "elapsed"
type TeamType = "garantido" | "caprichoso" | null
type GameMode = "normal" | "duelo"

interface RankingEntry {
  name: string
  score: number
  time: number
  difficulty: Difficulty
  date: string
  team: TeamType
}

interface DuelPlayer {
  name: string
  team: TeamType
  score: number
  moves: number
  time: number
  completed: boolean
}

// Random name generator
const generateRandomName = () => {
  // const prefixes = ["Abacatinho", "Super", "Mega", "Ultra", "Ninja", "Mestre", "Canvi", "Estrela", "Foguete"]
  // const suffixes = ["Jogador", "Gamer", "Pro", "Master", "Campeão", "Veloz", "Memória"]
  const prefixes = [
    "BoiBandido",
    "CurralMaster",
    "Garantilindo",
    "CaprichosoLoko",
    "CunhãNinja",
    "BatucadaForte",
    "PajéDoido",
    "TouroVeloz",
    "EstrelaFoguete",
    "CapriDoido",
    "GarantidoFamoso",
    "VermelhãoZika",
    "AzulzãoBrabo",
    "BumbáRei",
    "Amazonudo",
    "CapriFã",
    "Garantilover",
    "LendaDoBoi"
  ]

  const suffixes = [
    "do Garantido",
    "do Caprichoso",
    "Caçador de Caprichoso",
    "Dançarino do Curral",
    "Mito de Parintins",
    "Rei do Festival",
    "Puxador Oficial",
    "Amo da Arena",
    "Matador de Garantido",
    "Campeão da Batucada",
    "Brabo do Bumbódromo",
    "Lenda do Festival",
    "Pajé Supremo",
    "Cunhã Estiloso",
    "BoiRaiz"
  ]

  // const prefixes = [
  //   "Abacatinho",
  //   "Super",
  //   "Mega",
  //   "Ultra",
  //   "Ninja",
  //   "Mestre",
  //   "Canvi",
  //   "Estrela",
  //   "Foguete",
  //   "Bumbá",
  //   "Vermelhão",
  //   "Azulzão",
  //   "Pajé",
  //   "Cunhã",
  //   "Toadinho",
  //   "Curral",
  //   "Lenda",
  //   "Encantado",
  //   "Tribo",
  //   "Garantilindo",
  //   "Caprichosoide",
  //   "Batucada",
  //   "Puxador",
  //   "Garantilover",
  //   "CapriFã",
  //   "Porradeiro",
  //   "Amazonudo",
  //   "Caprilegend",
  //   "Garantioso"
  // ]

  // const suffixes = [
  //   "Jogador",
  //   "Gamer",
  //   "Pro",
  //   "Master",
  //   "Campeão",
  //   "Veloz",
  //   "Memória",
  //   "do Garantido",
  //   "do Caprichoso",
  //   "do Curral",
  //   "do Bumbódromo",
  //   "Matador de Caprichoso",
  //   "Rei da Batucada",
  //   "Cunhã do Boi",
  //   "Puxador Oficial",
  //   "Campeão de Parintins",
  //   "Amo do Festival",
  //   "Mito do Garantido",
  //   "Estrela do Caprichoso",
  //   "Dono da Arena",
  //   "Lenda de Parintins",
  //   "Pajé Supremo",
  //   "Mestre dos Bois"
  // ]
  const randomNum = Math.floor(Math.random() * 1000)

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${prefix}${suffix}${randomNum}`
}

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>([])
  const [opened, setOpened] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [showTeamSelect, setShowTeamSelect] = useState(false)
  const [showModeSelect, setShowModeSelect] = useState(true)
  const [playerName, setPlayerName] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [timerMode, setTimerMode] = useState<TimerMode>("elapsed")
  const [wrongPair, setWrongPair] = useState<number[]>([])
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [enableRanking, setEnableRanking] = useState(true)
  const [showQrCodes, setShowQrCodes] = useState(true)
  const [autoStart, setAutoStart] = useState(false)
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [winEffectActive, setWinEffectActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"game" | "settings" | "ranking">("game")
  const [selectedTeam, setSelectedTeam] = useState<TeamType>(null)
  const [gameMode, setGameMode] = useState<GameMode>("normal")
  const [duelPlayers, setDuelPlayers] = useState<DuelPlayer[]>([])
  const [currentDuelPlayer, setCurrentDuelPlayer] = useState(0)
  const [showDuelResults, setShowDuelResults] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    confirmText: "",
    isSuccess: false,
    onConfirm: () => { },
  })

  // Sound effects com volume reduzido para música de fundo
  const { play: playFlip } = useSound("/sounds/flip.mp3")
  const { play: playMatch } = useSound("/sounds/arcade-bonus-cartas-par.wav")
  const { play: playNoMatch } = useSound("/sounds/wrong-card.mp3")
  const { play: playWin } = useSound("/sounds/game-win-2016.wav")
  const { play: playLose } = useSound("/sounds/lose.mp3")
  const {
    play: playMusic,
    stop: stopMusic,
    isPlaying: isMusicPlaying,
  } = useSound("/sounds/background-music.mp3", true, 0.1)

  const confettiRef = useRef<HTMLDivElement>(null)

  const gameCardsQTY = symbols.length / 2
  const rank3stars = gameCardsQTY + 2
  const rank2stars = gameCardsQTY + 6
  const rank1stars = gameCardsQTY + 10

  // Get time based on difficulty
  const getTimeForDifficulty = (diff: Difficulty) => {
    const times = {
      easy: 180, // 3 minutes
      medium: 120, // 2 minutes
      hard: 60, // 1 minute
    }
    return times[diff]
  }

  // Shuffle function
  const shuffle = (array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Initialize game
  const initGame = () => {
    if (!selectedTeam) {
      setShowTeamSelect(true)
      return
    }

    setCards(shuffle(symbols))
    setOpened([])
    setMatched([])
    setWrongPair([])
    setMoves(0)
    setTimeElapsed(0)
    setTimeLeft(getTimeForDifficulty(difficulty))
    setWinEffectActive(false)
    setShowTeamSelect(false)

    // Só inicia o jogo automaticamente se autoStart estiver ativado
    if (autoStart) {
      setGameActive(true)
      if (musicEnabled && !isMusicPlaying) {
        playMusic()
      }
    } else {
      setGameActive(false)
    }
  }

  // Função para iniciar o jogo manualmente
  const startGame = () => {
    setGameActive(true)
    if (musicEnabled && !isMusicPlaying) {
      playMusic()
    }
  }

  // Select game mode
  const selectGameMode = (mode: GameMode) => {
    setGameMode(mode)
    setShowModeSelect(false)

    if (mode === "duelo") {
      setDuelPlayers([
        { name: "Jogador 1", team: null, score: 0, moves: 0, time: 0, completed: false },
        { name: "Jogador 2", team: null, score: 0, moves: 0, time: 0, completed: false },
      ])
      setCurrentDuelPlayer(0)
    }

    setShowTeamSelect(true)
  }

  // Select team and start game
  const selectTeamAndStart = (team: TeamType) => {
    setSelectedTeam(team)
    setShowTeamSelect(false)

    if (gameMode === "duelo") {
      const updatedPlayers = [...duelPlayers]
      updatedPlayers[currentDuelPlayer].team = team
      setDuelPlayers(updatedPlayers)
    }

    setTimeout(initGame, 100)
  }

  // Toggle music
  const toggleMusic = () => {
    if (musicEnabled) {
      stopMusic()
      setMusicEnabled(false)
    } else {
      setMusicEnabled(true)
      if (gameActive) {
        playMusic()
      }
    }
  }

  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Play sound if enabled
  const playSound = (sound: () => void) => {
    if (soundEnabled) {
      sound()
    }
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    console.log("🚀 ~ handleCardClick ~ index:", index)
    if (
      opened.length === 2 ||
      matched.includes(index) ||
      opened.includes(index) ||
      wrongPair.includes(index) ||
      !gameActive
    )
      return

    playSound(playFlip)

    const newOpened = [...opened, index]
    setOpened(newOpened)

    if (newOpened.length === 2) {
      setMoves((prev) => prev + 1)

      const [first, second] = newOpened

      if (cards[first] === cards[second]) {
        // Par correto
        setTimeout(() => {
          playSound(playMatch)
          setMatched((prev) => [...prev, first, second])
          setOpened([])
        }, 600)
      } else {
        // Par incorreto - sequência melhorada

        // 1. Primeiro, deixa ver as cartas por 800ms
        setTimeout(() => {
          // 2. Marca como par errado para iniciar efeito de erro
          setWrongPair([first, second])
        }, 800)

        // 3. Toca som de erro após mostrar as cartas
        setTimeout(() => {
          playSound(playNoMatch)
        }, 1000)

        // 4. Reset completo após efeito de erro
        setTimeout(() => {
          setWrongPair([])
          setOpened([])
        }, 1800) // Tempo total: 800ms (ver cartas) + 800ms (efeito erro) + 200ms (buffer)
      }
    }
  }

  // Get star rating based on moves
  const getRating = () => {
    if (moves <= rank3stars) return 3
    if (moves <= rank2stars) return 2
    if (moves <= rank1stars) return 1
    return 0
  }

  // Calculate score based on moves, time, and difficulty
  const calculateScore = () => {
    const baseScore = 1000
    const movesPenalty = moves * 10

    let timeBonus = 0
    if (timerMode === "countdown") {
      timeBonus = timeLeft * 5
    } else {
      const maxTime = getTimeForDifficulty(difficulty) * 2
      timeBonus = Math.max(0, maxTime - timeElapsed) * 2
    }

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    }

    return Math.max(0, Math.floor((baseScore - movesPenalty + timeBonus) * difficultyMultiplier[difficulty]))
  }

  // Trigger confetti effect
  const triggerConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const colors =
        selectedTeam === "garantido"
          ? ["#FF0000", "#FF5555", "#FF8888", "#FFAAAA", "#ffffff"]
          : ["#0000FF", "#5555FF", "#8888FF", "#AAAAFF", "#ffffff"]

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors,
          shapes: ["circle", "square"],
        })
      }, 250)
    }
  }

  // Add ranking entry
  const addRankingEntry = (name: string) => {
    const score = calculateScore()
    const time = timerMode === "countdown" ? getTimeForDifficulty(difficulty) - timeLeft : timeElapsed

    const newEntry: RankingEntry = {
      name,
      score,
      time,
      difficulty,
      date: new Date().toLocaleDateString(),
      team: selectedTeam,
    }

    const updatedRankings = [...rankings, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)
    setRankings(updatedRankings)

    localStorage.setItem("memoryGameRankings", JSON.stringify(updatedRankings))

    setShowNameInput(false)
    setPlayerName("")
    setShowModeSelect(true)
  }

  // Handle duel player finish
  const handleDuelPlayerFinish = (score: number, time: number) => {
    const updatedPlayers = [...duelPlayers]
    updatedPlayers[currentDuelPlayer].score = score
    updatedPlayers[currentDuelPlayer].moves = moves
    updatedPlayers[currentDuelPlayer].time = time
    updatedPlayers[currentDuelPlayer].completed = true

    setDuelPlayers(updatedPlayers)

    if (currentDuelPlayer === 0) {
      setCurrentDuelPlayer(1)
      setShowTeamSelect(true)
    } else {
      // Mostrar resultado do duelo
      setShowDuelResults(true)
    }
  }

  // End game
  const endGame = (byTime = false) => {
    setGameActive(false)
    stopMusic()

    if (byTime) {
      playSound(playLose)
      setAlertConfig({
        title: "Tempo esgotado!",
        description: "O tempo acabou. Tente novamente!",
        confirmText: "Jogar de novo",
        isSuccess: false,
        onConfirm: () => setShowModeSelect(true),
      })
      setShowAlert(true)
    } else {
      playSound(playWin)
      triggerConfetti()
      setWinEffectActive(true)

      setTimeout(() => {
        setWinEffectActive(false)

        if (enableRanking && gameMode === "normal") {
          setShowNameInput(true)
          setPlayerName(generateRandomName())
        } else if (gameMode === "duelo") {
          const score = calculateScore()
          const time = timerMode === "countdown" ? getTimeForDifficulty(difficulty) - timeLeft : timeElapsed
          handleDuelPlayerFinish(score, time)
        } else {
          const rating = getRating()
          let timeText = ""

          if (timerMode === "countdown") {
            const timeUsed = getTimeForDifficulty(difficulty) - timeLeft
            const minutes = Math.floor(timeUsed / 60)
            const seconds = timeUsed % 60
            timeText = `${minutes}m ${seconds}s`
          } else {
            const minutes = Math.floor(timeElapsed / 60)
            const seconds = timeElapsed % 60
            timeText = `${minutes}m ${seconds}s`
          }

          setAlertConfig({
            title: `Vitória do Boi ${selectedTeam === "garantido" ? "Garantido" : "Caprichoso"}!`,
            description: `Com ${moves} movimentos, ${rating} estrelas e tempo de ${timeText}.`,
            confirmText: "Jogar de novo",
            isSuccess: true,
            onConfirm: () => setShowModeSelect(true),
          })
          setShowAlert(true)
        }
      }, 3000)
    }
  }

  // Handle restart button click
  const handleRestart = () => {
    setAlertConfig({
      title: "Tem certeza?",
      description: "Progresso será perdido!",
      confirmText: "Reiniciar",
      isSuccess: false,
      onConfirm: () => setShowModeSelect(true),
    })
    setShowAlert(true)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    if (difficulty === newDifficulty) return

    setAlertConfig({
      title: "Mudar dificuldade",
      description: "Isso iniciará um novo jogo. Continuar?",
      confirmText: "Sim",
      isSuccess: false,
      onConfirm: () => {
        setDifficulty(newDifficulty)
        setTimeout(() => setShowModeSelect(true), 100)
      },
    })
    setShowAlert(true)
  }

  // Change timer mode
  const changeTimerMode = (newMode: TimerMode) => {
    if (timerMode === newMode) return

    setAlertConfig({
      title: "Mudar modo de tempo",
      description: "Isso iniciará um novo jogo. Continuar?",
      confirmText: "Sim",
      isSuccess: false,
      onConfirm: () => {
        setTimerMode(newMode)
        setTimeout(() => setShowModeSelect(true), 100)
      },
    })
    setShowAlert(true)
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameActive) {
      timer = setTimeout(() => {
        if (timerMode === "countdown") {
          if (timeLeft > 0) {
            setTimeLeft((prev) => prev - 1)
          } else {
            endGame(true)
          }
        } else {
          setTimeElapsed((prev) => prev + 1)
        }
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [timeLeft, timeElapsed, gameActive, timerMode])

  // Check for win condition
  useEffect(() => {
    if (matched.length === symbols.length && gameActive) {
      endGame(false)
    }
  }, [matched, gameActive])

  // Load rankings from localStorage
  useEffect(() => {
    const savedRankings = localStorage.getItem("memoryGameRankings")
    if (savedRankings) {
      try {
        setRankings(JSON.parse(savedRankings))
      } catch (e) {
        console.error("Error loading rankings:", e)
      }
    }
  }, [])

  // Initialize game on first render
  useEffect(() => {
    setShowModeSelect(true)
  }, [])

  // Render screens
  if (showModeSelect) {
    return <ModeSelection onSelectMode={selectGameMode} />
  }

  if (showTeamSelect) {
    return <TeamSelection gameMode={gameMode} currentDuelPlayer={currentDuelPlayer} onSelectTeam={selectTeamAndStart} />
  }

  return (
    <div
      className="flex justify-center items-center flex-col min-h-screen p-4"
      ref={confettiRef}
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Logo */}
      <motion.div
        className="flex justify-center mb-8 w-full max-w-[1000px]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/assets/games/jogo-da-memoria.svg"
          width={400}
          height={120}
          alt="Jogo da memoria"
          className="mb-4"
        />
      </motion.div>

      {/* Win effect overlay */}
      <AnimatePresence>
        {winEffectActive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={cn(
                "text-8xl font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]",
                selectedTeam === "garantido" ? "text-red-500" : "text-blue-500",
              )}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{
                scale: [0.5, 1.2, 1],
                rotate: [-10, 10, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.6, 1],
              }}
            >
              {/* Vitória do Boi {selectedTeam === "garantido" ? "Garantido" : "Caprichoso"}! */}
              <Image src={"/assets/vc-completou.png"} width={500} height={500} alt="você ganhou" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-10 mb-10 shadow-lg max-w-[1000px] w-full">
          <GameHeader
            gameMode={gameMode}
            currentDuelPlayer={currentDuelPlayer}
            selectedTeam={selectedTeam}
            activeTab={activeTab}
            musicEnabled={musicEnabled}
            soundEnabled={soundEnabled}
            onTabChange={setActiveTab}
            onToggleMusic={toggleMusic}
            onToggleSound={toggleSound}
          />

          {/* Game Tab */}
          {activeTab === "game" && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <GameStats
                moves={moves}
                rating={getRating()}
                timeDisplay={timerMode === "countdown" ? formatTime(timeLeft) : formatTime(timeElapsed)}
                matchedPairs={matched.length / 2}
                gameActive={gameActive}
                autoStart={autoStart}
                onRestart={handleRestart}
                onPlay={startGame}
              />

              <GameBoard
                cards={cards}
                opened={opened}
                matched={matched}
                wrongPair={wrongPair}
                onCardClick={handleCardClick}
              />
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4 text-xl">Dificuldade</h3>
                  <div className="flex gap-4">
                    <Button
                      variant={difficulty === "easy" ? "default" : "outline"}
                      size="lg"
                      onClick={() => changeDifficulty("easy")}
                      className="transition-all text-lg px-6 py-3"
                    >
                      Fácil
                    </Button>
                    <Button
                      variant={difficulty === "medium" ? "default" : "outline"}
                      size="lg"
                      onClick={() => changeDifficulty("medium")}
                      className="transition-all text-lg px-6 py-3"
                    >
                      Médio
                    </Button>
                    <Button
                      variant={difficulty === "hard" ? "default" : "outline"}
                      size="lg"
                      onClick={() => changeDifficulty("hard")}
                      className="transition-all text-lg px-6 py-3"
                    >
                      Difícil
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-xl">Modo de Tempo</h3>
                  <div className="flex gap-4">
                    <Button
                      variant={timerMode === "countdown" ? "default" : "outline"}
                      size="lg"
                      onClick={() => changeTimerMode("countdown")}
                      className="transition-all text-lg px-6 py-3"
                    >
                      Regressivo
                    </Button>
                    <Button
                      variant={timerMode === "elapsed" ? "default" : "outline"}
                      size="lg"
                      onClick={() => changeTimerMode("elapsed")}
                      className="transition-all text-lg px-6 py-3"
                    >
                      Cronômetro
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Switch id="auto-start" checked={autoStart} onCheckedChange={setAutoStart} />
                <Label htmlFor="auto-start" className="text-lg">
                  Início automático
                </Label>
              </div>

              {gameMode === "normal" && (
                <div className="flex items-center space-x-4">
                  <Switch id="ranking-mode" checked={enableRanking} onCheckedChange={setEnableRanking} />
                  <Label htmlFor="ranking-mode" className="text-lg">
                    Ativar ranking
                  </Label>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Switch id="qr-codes" checked={showQrCodes} onCheckedChange={setShowQrCodes} />
                <Label htmlFor="qr-codes" className="text-lg">
                  Mostrar patrocinadores
                </Label>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full transition-all text-lg py-4"
                  onClick={() => setShowModeSelect(true)}
                >
                  Mudar Modo de Jogo
                </Button>
              </div>
            </motion.div>
          )}

          {/* Ranking Tab */}
          {activeTab === "ranking" && (
            <motion.div
              className="space-y-4 max-h-[400px] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {rankings.length > 0 ? (
                rankings.map((entry, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "flex justify-between items-center p-4 rounded-md transition-all",
                      entry.team === "garantido"
                        ? "bg-red-100"
                        : entry.team === "caprichoso"
                          ? "bg-blue-100"
                          : "bg-muted",
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <span className="font-bold mr-4 text-xl">{index + 1}.</span>
                      <span className="truncate max-w-[250px] text-lg">{entry.name}</span>
                      {entry.team && (
                        <Image
                          src={
                            entry.team === "garantido"
                              ? "/assets/boi-vermelho-garantido.svg"
                              : "/assets/boi-azul-caprichoso.svg"
                          }
                          alt={entry.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                          width={50}
                          height={50}
                          className="ml-4"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{formatTime(entry.time)}</span>
                      <span className="font-bold text-lg">{entry.score} pts</span>
                      <Trophy size={24} className="text-yellow-500" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-lg">
                  Nenhum ranking ainda. Jogue para registrar sua pontuação!
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Patrocinadores */}
      {showQrCodes && (
        <motion.div
          className="flex justify-center gap-8 mt-0 w-full max-w-[1000px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-lg flex flex-col items-center gap-2">
            <h2 className="bg-white px-2 rounded-lg font-bold shadow-md">Patrocínio Oficial</h2>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center gap-2 bg-white px-0 py-3 rounded-lg shadow-md">
                <Image src="/assets/sponsorship/logo-zaplus.png" width={90} height={90} alt="Zaplus" />
                <Image src="/assets/qr-zaplus-car.png" alt="QR Zaplus" width={100} height={100} />
              </div>
              <p className="bg-white px-2 rounded-lg text-center shadow-md">Siga a gente no instagram</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dialogs */}
      <AlertDialog open={showNameInput} onOpenChange={setShowNameInput}>
        <AlertDialogContent className="max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Vitória do Boi {selectedTeam === "garantido" ? "Garantido" : "Caprichoso"}!
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mb-6 text-lg">
                Pontuação: <span className="font-bold">{calculateScore()} pontos</span>
              </div>
              <div className="mb-6 text-lg">Digite seu nome para o ranking ou use o nome gerado automaticamente.</div>

              {/* Input com botão X */}
              <div className="relative mb-4">
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Seu nome"
                  className="text-lg p-3 pr-10"
                />
                {playerName && (
                  <button
                    type="button"
                    onClick={() => setPlayerName("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setPlayerName(generateRandomName())}
                className="w-full mb-6 text-lg py-3"
              >
                Gerar nome aleatório
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel
              className="text-lg px-6 py-3"
              onClick={() => {
                setShowNameInput(false)
                setShowModeSelect(true)
              }}
            >
              Pular
            </AlertDialogCancel>
            <AlertDialogAction
              className="text-lg px-6 py-3"
              onClick={() => addRankingEntry(playerName || generateRandomName())}
            >
              Salvar pontuação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duel results dialog - Versão visual melhorada */}
      <AlertDialog open={showDuelResults} onOpenChange={setShowDuelResults}>
        <AlertDialogContent className="max-w-[900px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-5xl text-center">🏆 Resultado do Duelo!</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {duelPlayers.length > 0 && (
                    <>
                      <div
                        className={cn(
                          "p-4 rounded-lg",
                          duelPlayers[0]?.team === "garantido" ? "bg-red-100" : "bg-blue-100",
                        )}
                      >
                        <h3 className="font-bold text-3xl mb-2">Jogador 1</h3>
                        <div className="flex items-center mb-2 text-xl">
                          <Image
                            src={
                              duelPlayers[0]?.team === "garantido"
                                ? "/assets/boi-vermelho-garantido.svg"
                                : "/assets/boi-azul-caprichoso.svg"
                            }
                            alt={duelPlayers[0]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                            width={40}
                            height={40}
                            className="mr-2"
                          />
                          <span>{duelPlayers[0]?.team === "garantido" ? "Garantido" : "Caprichoso"}</span>
                        </div>
                        <div className="space-y-1 ">
                          <div className="text-xl">
                            Pontuação: <span className=" font-bold">{duelPlayers[0]?.score}</span>
                          </div>
                          <div className="text-xl">
                            Movimentos: <span className="font-bold">{duelPlayers[0]?.moves}</span>
                          </div>
                          <div className="text-xl">
                            Tempo: <span className="font-bold">{formatTime(duelPlayers[0]?.time || 0)}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "p-4 rounded-lg",
                          duelPlayers[1]?.team === "garantido" ? "bg-red-100" : "bg-blue-100",
                        )}
                      >
                        <h3 className="font-bold mb-2 text-3xl">Jogador 2</h3>
                        <div className="flex items-center mb-2 text-xl">
                          <Image
                            src={
                              duelPlayers[1]?.team === "garantido"
                                ? "/assets/boi-vermelho-garantido.svg"
                                : "/assets/boi-azul-caprichoso.svg"
                            }
                            alt={duelPlayers[1]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                            width={40}
                            height={40}
                            className="mr-2"
                          />
                          <span>{duelPlayers[1]?.team === "garantido" ? "Garantido" : "Caprichoso"}</span>
                        </div>
                        <div className="space-y-1 text-xl">
                          <div>
                            Pontuação: <span className="font-bold">{duelPlayers[1]?.score}</span>
                          </div>
                          <div>
                            Movimentos: <span className="font-bold">{duelPlayers[1]?.moves}</span>
                          </div>
                          <div>
                            Tempo: <span className="font-bold">{formatTime(duelPlayers[1]?.time || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-green-500 rounded-lg text-center">
                  <h3 className="font-bold text-white text-6xl mb-2">🎉 Vencedor</h3>
                  {duelPlayers.length > 1 && (
                    <>
                      {duelPlayers[0]?.score > duelPlayers[1]?.score ? (
                        <div className="flex flex-col items-center">
                          {/* <span className="text-lg font-bold">Jogador 1</span> */}
                          <Image
                            src={"/assets/games/ganhador/jogador-1-ganhou.svg"}
                            width={400}
                            height={400}
                            alt="jogador 1"
                          />
                          <div className="flex items-center mt-2">
                            <Image
                              src={
                                duelPlayers[0]?.team === "garantido"
                                  ? "/assets/boi-vermelho-garantido.svg"
                                  : "/assets/boi-azul-caprichoso.svg"
                              }
                              alt={duelPlayers[0]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                              width={40}
                              height={40}
                              className="mr-2"
                            />
                            <span className="text-2xl text-white">
                              Boi {duelPlayers[0]?.team === "garantido" ? "Garantido" : "Caprichoso"}
                            </span>
                          </div>
                          <span className="text-xl mt-1 text-gray-100">{duelPlayers[0]?.score} pontos</span>
                        </div>
                      ) : duelPlayers[1]?.score > duelPlayers[0]?.score ? (
                        <div className="flex flex-col items-center">
                          {/* <span className="text-lg font-bold">Jogador 2</span> */}
                          <Image
                            src={"/assets/games/ganhador/jogador-2-ganhou.svg"}
                            width={400}
                            height={400}
                            alt="jogador 2"
                          />
                          <div className="flex items-center mt-2">
                            <Image
                              src={
                                duelPlayers[1]?.team === "garantido"
                                  ? "/assets/boi-vermelho-garantido.svg"
                                  : "/assets/boi-azul-caprichoso.svg"
                              }
                              alt={duelPlayers[1]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                              width={40}
                              height={40}
                              className="mr-2"
                            />
                            <span className="text-2xl text-white">
                              Boi {duelPlayers[1]?.team === "garantido" ? "Garantido" : "Caprichoso"}
                            </span>
                          </div>
                          <span className="text-lg mt-1 text-gray-100">{duelPlayers[1]?.score} pontos</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-4xl font-bold">🤝 Empate!</span>
                          <span className="text-2xl mt-1 text-gray-600">
                            Ambos fizeram {duelPlayers[0]?.score} pontos
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="text-lg px-6 py-3"
              onClick={() => {
                setShowDuelResults(false)
                setShowModeSelect(true)
              }}
            >
              Jogar Novamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg whitespace-pre-line">
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction className="text-lg px-6 py-3" onClick={alertConfig.onConfirm}>
              {alertConfig.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
