"use client"

import { useEffect, useRef, useState } from "react"

export function useSound(soundUrl: string, loop = false, volume = 1.0) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Create audio element only on client side
    if (typeof window !== "undefined") {
      const audio = new Audio(soundUrl)
      audio.loop = loop
      audio.volume = volume
      audioRef.current = audio

      audio.addEventListener("canplaythrough", () => {
        setIsLoaded(true)
      })

      audio.addEventListener("ended", () => {
        if (!loop) {
          setIsPlaying(false)
        }
      })

      return () => {
        audio.pause()
        audio.removeEventListener("canplaythrough", () => {})
        audio.removeEventListener("ended", () => {})
      }
    }
  }, [soundUrl, loop, volume])

  const play = () => {
    if (audioRef.current) {
      // Reset the audio to the beginning if it's already playing
      if (!loop) {
        audioRef.current.currentTime = 0
      }

      // Play the audio
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Error playing sound:", error)
        })
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return { play, stop, isPlaying, isLoaded }
}
