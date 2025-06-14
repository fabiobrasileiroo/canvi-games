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
import { Trophy, Music, Music2, Volume2, VolumeX, Settings, Home, Users, User } from "lucide-react"

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
  const prefixes = ["Abacatinho", "Super", "Mega", "Ultra", "Ninja", "Mestre", "Canvi", "Estrela", "Foguete"]
  const suffixes = ["Jogador", "Gamer", "Pro", "Master", "Campeão", "Veloz", "Memória"]
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
    onConfirm: () => {},
  })

  // Sound effects
  const { play: playFlip, stop: stopFlip } = useSound("/sounds/flip.mp3")
  const { play: playMatch, stop: stopMatch } = useSound("/sounds/arcade-bonus-cartas-par.wav")
  const { play: playNoMatch, stop: stopNoMatch } = useSound("/sounds/wrong-card.wav")
  const { play: playWin, stop: stopWin } = useSound("/sounds/game-win-2016.wav")
  const { play: playLose, stop: stopLose } = useSound("/sounds/lose.mp3")
  const { play: playMusic, stop: stopMusic, isPlaying: isMusicPlaying } = useSound("/sounds/background-music.mp3", true)

  const confettiRef = useRef<HTMLDivElement>(null)
  const winEffectRef = useRef<HTMLDivElement>(null)

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
    setGameActive(true)
    setWinEffectActive(false)
    setShowTeamSelect(false)

    if (musicEnabled && !isMusicPlaying) {
      playMusic()
    }
  }

  // Select game mode
  const selectGameMode = (mode: GameMode) => {
    setGameMode(mode)
    setShowModeSelect(false)

    if (mode === "duelo") {
      // Initialize duel players
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
      // Update current player's team
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
    // Prevent clicking if two cards are already opened or card is already matched/opened
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

    // If two cards are opened, check for match
    if (newOpened.length === 2) {
      setMoves((prev) => prev + 1)

      const [first, second] = newOpened

      if (cards[first] === cards[second]) {
        // Match found
        setTimeout(() => {
          playSound(playMatch)
          setMatched((prev) => [...prev, first, second])
          setOpened([])
        }, 500)
      } else {
        // No match
        setWrongPair([first, second])
        playSound(playNoMatch)

        setTimeout(() => {
          setWrongPair([])
          setOpened([])
        }, 1000)
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
      // For elapsed mode, faster times get higher bonus
      const maxTime = getTimeForDifficulty(difficulty) * 2 // Expected max time
      timeBonus = Math.max(0, maxTime - timeElapsed) * 2
    }

    // Difficulty multiplier
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

      // Use team colors for confetti
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

        confetti({
          ...defaults,
          particleCount,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors,
          shapes: ["star"],
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

    // Save to localStorage
    localStorage.setItem("memoryGameRankings", JSON.stringify(updatedRankings))

    setShowNameInput(false)
    setPlayerName("")

    // Sempre voltar para a seleção de modo após salvar ranking
    setShowModeSelect(true)
  }

  // Handle duel player finish
  const handleDuelPlayerFinish = (score: number, time: number) => {
    // Update current player's results
    const updatedPlayers = [...duelPlayers]
    updatedPlayers[currentDuelPlayer].score = score
    updatedPlayers[currentDuelPlayer].moves = moves
    updatedPlayers[currentDuelPlayer].time = time
    updatedPlayers[currentDuelPlayer].completed = true

    setDuelPlayers(updatedPlayers)

    // Check if both players have completed
    if (currentDuelPlayer === 0) {
      // First player finished, switch to second player
      setCurrentDuelPlayer(1)
      setShowTeamSelect(true)
    } else {
      // Both players finished, show results
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
        onConfirm: () => setShowModeSelect(true), // Alterado para voltar à seleção de modo
      })
      setShowAlert(true)
    } else {
      playSound(playWin)
      triggerConfetti()
      setWinEffectActive(true)

      // Show victory effect for 3 seconds before showing dialog
      setTimeout(() => {
        setWinEffectActive(false)

        // If ranking is enabled in normal mode, show name input
        if (enableRanking && gameMode === "normal") {
          setShowNameInput(true)
          setPlayerName(generateRandomName()) // Set a default random name
        } else if (gameMode === "duelo") {
          // In duel mode, calculate score and handle player finish
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
            onConfirm: () => setShowModeSelect(true), // Alterado para voltar à seleção de modo
          })
          setShowAlert(true)
        }
      }, 3000) // 3 second delay before showing dialog
    }
  }

  // Handle restart button click
  const handleRestart = () => {
    setAlertConfig({
      title: "Tem certeza?",
      description: "Progresso será perdido!",
      confirmText: "Reiniciar",
      isSuccess: false,
      onConfirm: () => {
        // Alterado para voltar à seleção de modo
        setShowModeSelect(true)
      },
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
        setTimeout(() => setShowModeSelect(true), 100) // Alterado para voltar à seleção de modo
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
        setTimeout(() => setShowModeSelect(true), 100) // Alterado para voltar à seleção de modo
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
    // Show mode selection on first load
    setShowModeSelect(true)

    return () => {
      stopMusic()
      stopFlip()
      stopMatch()
      stopNoMatch()
      stopWin()
      stopLose()
    }
  }, [])

  // Render game mode selection screen
  if (showModeSelect) {
    return (
      <div
        className="flex justify-center items-center flex-col min-h-screen p-4"
        style={{
          backgroundImage: `url("/background.svg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Card className="p-6 mb-6 shadow-2xl max-w-[600px] w-full bg-white !backdrop-blur-md !rounded-2xl">
          <h1 className="!text-3xl font-bold text-center mb-6 text-gray-900">Escolha o Modo de Jogo</h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="h-48 w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white text-xl rounded-xl"
              onClick={() => selectGameMode("normal")}
            >
              <div className="flex flex-col items-center">
                <User size={64} className="mb-4" />
                <span>Modo Normal</span>
                <span className="text-sm mt-2">Jogue sozinho</span>
              </div>
            </Button>

            <Button
              className="h-48 w-full sm:w-1/2 bg-purple-600 hover:bg-purple-700 text-white text-xl rounded-xl"
              onClick={() => selectGameMode("duelo")}
            >
              <div className="flex flex-col items-center">
                <Users size={64} className="mb-4" />
                <span>Modo Duelo</span>
                <span className="text-sm mt-2">Jogue contra um amigo</span>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Render team selection screen
  if (showTeamSelect) {
    return (
      <div
        className="flex justify-center items-center flex-col min-h-screen p-4"
        style={{
          backgroundImage: `url("/background.svg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Card className="p-6 mb-6 shadow-2xl max-w-[600px] w-full bg-white !backdrop-blur-md !rounded-2xl">
          <h1 className="!text-3xl font-bold text-center mb-6 text-gray-900">
            {gameMode === "duelo" ? `Jogador ${currentDuelPlayer + 1}: Escolha seu Boi` : "Escolha seu Boi"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col gap-8 justify-center items-center h-96 w-full sm:w-1/2  text-white text-xl "
              onClick={() => selectTeamAndStart("garantido")}
            >
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/boi-vermelho-garantido.svg"
                  alt="Boi Garantido"
                  width={200}
                  height={200}
                  className="mb-2"
                />
                <span className="text-black font-bold uppercase"> Boi Garantido</span>
              </div>
            </Button>

            <Button
              className="h-96 w-full sm:w-1/2 border-4 border-blue-600 hover:bg-blue-700 text-white text-xl rounded-xl"
              onClick={() => selectTeamAndStart("caprichoso")}
            >
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/boi-azul-caprichoso.svg"
                  alt="Boi Caprichoso"
                  width={200}
                  height={200}
                  className="mb-2"
                />
                Boi Caprichoso
              </div>
            </Button>
          </div>
        </Card>
      </div>
    )
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
      {/* aqui */}
      {/* Win effect overlay */}
      <AnimatePresence>
        {winEffectActive && (
          <motion.div
            ref={winEffectRef}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={cn(
                "text-6xl font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]",
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
              Vitória do Boi {selectedTeam === "garantido" ? "Garantido" : "Caprichoso"}!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Codes */}
      {showQrCodes && (
        <div className="flex justify-center gap-4 mb-4 w-full max-w-[600px]">
          <div className="bg-white p-2 rounded-lg shadow-md">
            {/* <div className="text-center text-sm font-bold mb-1">Zaplus</div> */}
            <Image src="/assets/sponsorship/logo-caboclo.svg" width={50} height={50} alt="Zaplus"/>
            <Image src="/assets/qr-zaplus.png" alt="QR Zaplus" width={80} height={80} />
          </div>
          <div className="bg-white p-2 rounded-lg shadow-md">
            <div className="text-center text-sm font-bold mb-1">Caboclo</div>
            <Image src="/assets/qr-caboclo.png" alt="QR Caboclo" width={80} height={80} />
          </div>
        </div>
      )}

      <Card className="p-6 mb-6 shadow-lg max-w-[600px] w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {gameMode === "duelo" ? `Jogador ${currentDuelPlayer + 1}` : "Jogo da Memória"}
            </h1>
            <div className="flex items-center">
              <Image
                src={
                  selectedTeam === "garantido"
                    ? "/assets/boi-vermelho-garantido.svg"
                    : "/assets/boi-azul-caprichoso.svg"
                }
                alt={selectedTeam === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                width={75}
                height={75}
                className=""
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab("game")}
              className={activeTab === "game" ? "bg-muted" : ""}
              title="Jogo"
            >
              <Home size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab("settings")}
              className={activeTab === "settings" ? "bg-muted" : ""}
              title="Configurações"
            >
              <Settings size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab("ranking")}
              className={activeTab === "ranking" ? "bg-muted" : ""}
              title="Ranking"
            >
              <Trophy size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMusic}
              title={musicEnabled ? "Desativar música" : "Ativar música"}
            >
              {musicEnabled ? <Music2 size={20} /> : <Music size={20} className="text-muted-foreground" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              title={soundEnabled ? "Desativar sons" : "Ativar sons"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-muted-foreground" />}
            </Button>
          </div>
        </div>

        {/* Game Tab */}
        {activeTab === "game" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="stars mr-4">
                  {[0, 1, 2].map((star) => (
                    <i
                      key={star}
                      className={`fa ${getRating() > star ? "fa-star text-yellow-500" : "fa-star-o text-gray-400"} mr-1`}
                    ></i>
                  ))}
                </div>
                <span className="moves font-medium">{moves}</span> Movimentos
              </div>

              <div className="flex items-center">
                <span id="timer" className="font-bold text-lg">
                  {timerMode === "countdown" ? formatTime(timeLeft) : formatTime(timeElapsed)}
                </span>
                <Button variant="ghost" size="icon" className="ml-4" onClick={handleRestart}>
                  <i className="fa fa-repeat"></i>
                </Button>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{matched.length / 2}</div>
              <div className="text-sm text-muted-foreground">Pares Encontrados</div>
            </div>

            <div className="deck bg-[#FFFA62] p-4 rounded-xl shadow-[8px_8px_0_0_#000000]">
              <div className="grid grid-cols-4 gap-3">
                {cards.map((symbol, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "card relative h-16 w-16 sm:h-24 sm:w-24 rounded-lg cursor-pointer",
                      matched.includes(index) && "bg-[#9BCB3C]",
                      opened.includes(index) && !matched.includes(index) && "bg-[#89C4FF]",
                      wrongPair.includes(index) && "bg-[#EE0E51]",
                      !opened.includes(index) &&
                        !matched.includes(index) &&
                        !wrongPair.includes(index) &&
                        "bg-[#FFCF7F]",
                    )}
                    onClick={() => handleCardClick(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      rotateY: opened.includes(index) || matched.includes(index) ? 0 : 180,
                      ...(wrongPair.includes(index) && {
                        x: [0, -10, 10, -10, 10, 0],
                        transition: { duration: 0.5 },
                      }),
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="w-full h-full rounded-lg bg-[#FFCF7F] flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF9090]"></div>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {(
                        !opened.includes(index) || matched.includes(index)) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src={`/assets/${symbol}`}
                            alt={symbol}
                            width={50}
                            height={50}
                            className="object-contain sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Dificuldade</h3>
                <div className="flex gap-2">
                  <Button
                    variant={difficulty === "easy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeDifficulty("easy")}
                  >
                    Fácil
                  </Button>
                  <Button
                    variant={difficulty === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeDifficulty("medium")}
                  >
                    Médio
                  </Button>
                  <Button
                    variant={difficulty === "hard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeDifficulty("hard")}
                  >
                    Difícil
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Modo de Tempo</h3>
                <div className="flex gap-2">
                  <Button
                    variant={timerMode === "countdown" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeTimerMode("countdown")}
                  >
                    Regressivo
                  </Button>
                  <Button
                    variant={timerMode === "elapsed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeTimerMode("elapsed")}
                  >
                    Cronômetro
                  </Button>
                </div>
              </div>
            </div>

            {gameMode === "normal" && (
              <div className="flex items-center space-x-2">
                <Switch id="ranking-mode" checked={enableRanking} onCheckedChange={setEnableRanking} />
                <Label htmlFor="ranking-mode">Ativar ranking</Label>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="qr-codes" checked={showQrCodes} onCheckedChange={setShowQrCodes} />
              <Label htmlFor="qr-codes">Mostrar QR Codes</Label>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => setShowModeSelect(true)}>
                Mudar Modo de Jogo
              </Button>
            </div>
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === "ranking" && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {rankings.length > 0 ? (
              rankings.map((entry, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-center p-2 rounded-md",
                    entry.team === "garantido"
                      ? "bg-red-100"
                      : entry.team === "caprichoso"
                        ? "bg-blue-100"
                        : "bg-muted",
                  )}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    <span className="truncate max-w-[150px]">{entry.name}</span>
                    {entry.team && (
                      <Image
                        src={entry.team === "garantido" ? "/assets/boi-garantido.png" : "/assets/boi-caprichoso.png"}
                        alt={entry.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                        width={16}
                        height={16}
                        className="ml-2"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatTime(entry.time)}</span>
                    <span className="font-bold">{entry.score} pts</span>
                    <Trophy size={16} className="text-yellow-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum ranking ainda. Jogue para registrar sua pontuação!
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Name input dialog */}
      <AlertDialog open={showNameInput} onOpenChange={setShowNameInput}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Vitória do Boi {selectedTeam === "garantido" ? "Garantido" : "Caprichoso"}!
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mb-4">
                Pontuação: <span className="font-bold">{calculateScore()} pontos</span>
              </div>
              <div className="mb-4">Digite seu nome para o ranking ou use o nome gerado automaticamente.</div>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu nome"
                className="mb-2"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlayerName(generateRandomName())}
                className="w-full mb-4"
              >
                Gerar nome aleatório
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel
              onClick={() => {
                setShowNameInput(false)
                setShowModeSelect(true) // Alterado para voltar à seleção de modo
              }}
            >
              Pular
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => addRankingEntry(playerName || generateRandomName())}>
              Salvar pontuação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duel results dialog */}
      <AlertDialog open={showDuelResults} onOpenChange={setShowDuelResults}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resultado do Duelo!</AlertDialogTitle>
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
                        <h3 className="font-bold text-lg mb-2">Jogador 1</h3>
                        <div className="flex items-center mb-2">
                          <Image
                            src={
                              duelPlayers[0]?.team === "garantido"
                                ? "/assets/boi-vermelho-garantido.svg"
                                : "/assets/boi-azul-caprichoso.svg"
                            }
                            alt={duelPlayers[0]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                            width={30}
                            height={30}
                            className="mr-2"
                          />
                          <span>{duelPlayers[0]?.team === "garantido" ? "Garantido" : "Caprichoso"}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            {/* Pontuação: <span className="font-bold">{duelPlayers[0]?.score}</span> */}
                          </div>
                          <div>
                            Movimentos: <span className="font-bold">{duelPlayers[0]?.moves}</span>
                          </div>
                          <div>
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
                        <h3 className="font-bold text-lg mb-2">Jogador 2</h3>
                        <div className="flex items-center mb-2">
                          <Image
                            src={
                              duelPlayers[1]?.team === "garantido"
                                ? "/assets/boi-vermelho-garantido.svg"
                                : "/assets/boi-azul-caprichoso.svg"
                            }
                            alt={duelPlayers[1]?.team === "garantido" ? "Boi Garantido" : "Boi Caprichoso"}
                            width={30}
                            height={30}
                            className="mr-2"
                          />
                          <span>{duelPlayers[1]?.team === "garantido" ? "Garantido" : "Caprichoso"}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            {/* Pontuação: <span className="font-bold">{duelPlayers[1]?.score}</span> */}
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

                <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-center">
                  <h3 className="font-bold text-xl mb-2">Vencedor</h3>
                  {duelPlayers.length > 1 && (
                    <>
                      {duelPlayers[0]?.score > duelPlayers[1]?.score ? (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold">Jogador 1</span>
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
                            <span className="text-lg">
                              Boi {duelPlayers[0]?.team === "garantido" ? "Garantido" : "Caprichoso"}
                            </span>
                          </div>
                        </div>
                      ) : duelPlayers[1]?.score > duelPlayers[0]?.score ? (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold">Jogador 2</span>
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
                            <span className="text-lg">
                              Boi {duelPlayers[1]?.team === "garantido" ? "Garantido" : "Caprichoso"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">Empate!</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowDuelResults(false)
                setShowModeSelect(true) // Alterado para voltar à seleção de modo
              }}
            >
              Jogar Novamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Regular alert dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction onClick={alertConfig.onConfirm}>{alertConfig.confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
