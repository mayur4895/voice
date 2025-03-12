"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import SwitchButton from "@/components/SwitchButton"
import WaveAnimation from "@/components/Hallofwaves"

export default function Carousel() {
  // Start with the middle card selected
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false) // For play/pause functionality
  const [isSwitchedOn, setIsSwitchedOn] = useState(false) // For the switch button functionality
  const [isGradient, setIsGradient] = useState(false); // State managed in parent
  const noisyAudioRef = useRef<HTMLAudioElement>(null)
  const clearAudioRef = useRef<HTMLAudioElement>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Array of card contents
  const cards = [
    { id: 1, title: "Analytics", description: "Track your performance metrics", img:"/indian.jpg" },
    { id: 2, title: "Automation", description: "Streamline your workflow", img:"/ukrain.jpg" },
    { id: 3, title: "Collaboration", description: "Work together seamlessly", img:"/russian.jpg" },
    { id: 4, title: "Integration", description: "Connect with your favorite tools", img:"/man.jpg" },
    { id: 5, title: "Security", description: "Keep your data protected", img:"/robot.jpg" },
  ]
  useEffect(() => {
    const noisyAudio = noisyAudioRef.current
    const clearAudio = clearAudioRef.current
    
    const handleAudioEnd = () => setIsPlaying(false)

    if (noisyAudio) noisyAudio.addEventListener('ended', handleAudioEnd)
    if (clearAudio) clearAudio.addEventListener('ended', handleAudioEnd)

    return () => {
      if (noisyAudio) noisyAudio.removeEventListener('ended', handleAudioEnd)
      if (clearAudio) clearAudio.removeEventListener('ended', handleAudioEnd)
    }
  }, [])

  useEffect(() => {
    currentAudioRef.current = isSwitchedOn ? clearAudioRef.current : noisyAudioRef.current
    const otherAudio = isSwitchedOn ? noisyAudioRef.current : clearAudioRef.current

    if (isPlaying) {
      otherAudio?.pause()
      if (currentAudioRef.current) {
        currentAudioRef.current.currentTime = 0
        currentAudioRef.current.play()
      }
    } else {
      currentAudioRef.current?.pause()
      otherAudio?.pause()
    }

    return () => {
      currentAudioRef.current?.pause()
      otherAudio?.pause()
    }
  }, [isPlaying, isSwitchedOn])

  // Function to move to the next card
  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }

  // Function to move to the previous card
  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
  }

  // Reset animation flag after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [selectedIndex])

  // Play the correct audio based on the state
  useEffect(() => {
    if (isPlaying) {
      if (isSwitchedOn) {
        // Play clear US accent audio
        clearAudioRef.current?.play()
      } else {
        // Play noisy audio
        noisyAudioRef.current?.play()
      }
    } else {
      // Pause both audios if not playing
      noisyAudioRef.current?.pause()
      clearAudioRef.current?.pause()
    }
  }, [isPlaying, isSwitchedOn])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-transparent  p-4 z-50">
              <WaveAnimation isGradient={isGradient} />
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Our Features</h2>

      <div className="relative w-full max-w-5xl overflow-hidden px-4">
        <div className="flex items-center justify-center h-80">
          {cards.map((card, index) => {
            const position = (index - selectedIndex + cards.length) % cards.length
            const normalizedPosition = position > 2 ? position - cards.length : position

            return (
              <div
                key={card.id}
                className={cn(
                  "absolute flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out",
                  "bg-white border border-slate-200",
                  "transform-gpu",
                )}
                style={{
                  width: normalizedPosition === 0 ? "320px" : "280px",
                  height: normalizedPosition === 0 ? "240px" : "200px",
                  opacity: Math.abs(normalizedPosition) > 2 ? 0 : 1 - Math.abs(normalizedPosition) * 0.2,
                  zIndex: 20 - Math.abs(normalizedPosition),
                  transform: `translateX(${normalizedPosition * 220}px) scale(${1 - Math.abs(normalizedPosition) * 0.1})`,
                }}
              >
                <Image src={card.img} alt={"img"} width={100} height={100} className=" p-2  rounded-full  bg-contain bg-center"/>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-600 text-center">{card.description}</p>
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 z-20"
          aria-label="Previous card"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 z-20"
          aria-label="Next card"
          disabled={isAnimating}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicator dots */}
      <div className="flex space-x-2 mt-8">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setSelectedIndex(index)
              }
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === selectedIndex ? "bg-indigo-600 w-6" : "bg-slate-300 hover:bg-slate-400",
            )}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>

      {/* Play/Pause Button and Switch */}
      <div className="mt-8 flex items-center space-x-4 bg-white border mx-auto rounded-full h-16 w-[500px] justify-center">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        {/* Switch Button */}
     
        <SwitchButton setIsGradient={setIsGradient} />
      </div>

      {/* Audio Files */}
      <audio 
        ref={noisyAudioRef} 
        src="/indian_accent_intro_noisy.mp3" 
        preload="auto"
      />
      <audio 
        ref={clearAudioRef} 
        src="/us_accent_intro (1).mp3" 
        preload="auto"
      />
      
      
      <Button className="mt-5">Try Your Own Voice</Button>
    </div>
  )
}

 
