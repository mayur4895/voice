'use client'
import { GlobeAnimation } from "@/components/Globe";
import Header from "@/components/Header";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { RainButton } from "@/components/rainbow-button";
import SwitchButton from "@/components/SwitchButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
 
export default function Home() {

  const [selectedIndex, setSelectedIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSwitchedOn, setIsSwitchedOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [latestText, setLatestText] = useState("")
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false)
  const [isSwitchedOnRecorded, setIsSwitchedOnRecorded] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(null)
  const noisyAudioRef = useRef<HTMLAudioElement>(null)
  const playbackPositionRef = useRef(0)

  
  const cards = [
    { id: 1, title: "US Female (Aria)", description: "Experience a natural and clear US female voice.", img: "/ukrain.jpg", audioFile: "/play-aria.mp3", },
    { id: 2, title: "British Male (Ryan)", description: "Enjoy a rich and powerful British male voice.", img: "/usmale.jpg", audioFile: "/play-ryan.mp3" },
    { id: 3, title: "Australian Female (Natasha)", description: "Experience a smooth and professional Australian female voice.", img: "/natasha.jpg", audioFile: "/play-natasha.mp3" },
    { id: 4, title: "US Female (Jenny)", description: "A warm and friendly US female voice for any occasion.", img: "/jenny.jpg", audioFile: "/play-jenny.mp3" },
    { id: 5, title: "British Female (Libby)", description: "A refined and elegant British female voice.", img: "/libby.jpg", audioFile: "/play-libby.mp3" },
    { id: 6, title: "Canadian Male (Liam)", description: "A deep and engaging Canadian male voice.", img: "/canadianmale.jpg", audioFile: "/play-liam.mp3" }
  ];

  // Handle audio end for both main and recorded audio
  useEffect(() => {
    const handleAudioEnd = () => setIsPlaying(false)
    const handleRecordedAudioEnd = () => setIsPlayingRecorded(false)

    if (isSwitchedOn && currentAudio) {
      currentAudio.addEventListener('ended', handleAudioEnd)
    }
    if (isSwitchedOnRecorded && recordedAudio) {
      recordedAudio.addEventListener('ended', handleRecordedAudioEnd)
    }

    return () => {
      if (currentAudio) currentAudio.removeEventListener('ended', handleAudioEnd)
      if (recordedAudio) recordedAudio.removeEventListener('ended', handleRecordedAudioEnd)
    }
  }, [currentAudio, recordedAudio, isSwitchedOn, isSwitchedOnRecorded])

  // Handle main audio playback
  useEffect(() => {
    if (isSwitchedOn && isPlaying) {
      const selectedCard = cards[selectedIndex]
      if (currentAudio) {
        currentAudio.pause()
      }

      const newAudio = new Audio(selectedCard.audioFile)
      newAudio.play()
      setCurrentAudio(newAudio)
    } else if (!isSwitchedOn && isPlaying) {
      if (noisyAudioRef.current) {
        noisyAudioRef.current.currentTime = playbackPositionRef.current
        noisyAudioRef.current.play()
      }
    } else {
      currentAudio?.pause()
      noisyAudioRef.current?.pause()
      if (noisyAudioRef.current) {
        playbackPositionRef.current = noisyAudioRef.current.currentTime
      }
    }

    return () => {
      currentAudio?.pause()
      noisyAudioRef.current?.pause()
    }
  }, [isPlaying, isSwitchedOn, selectedIndex])
 

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }

  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [selectedIndex])
  return (
   
   
 <div className=" flex items-center w-full flex-col">
      <Header/>
    <div className="pt-10">
      <div className=" items-center flex flex-col justify-center">
      <div className=" flex items-center justify-center">
       <div className="flex items-center justify-center h-80">
       {cards.map((card, index) => {
  const position = (index - selectedIndex + cards.length) % cards.length;
  const normalizedPosition = position > 2 ? position - cards.length : position;

  return (
    <div
      key={card.id}
      className={cn(
        "absolute flex flex-col items-center justify-center p-6 rounded-xl shadow-xl transition-all duration-500 ease-in-out",
        "bg-gradient-to-b from-white to-gray-100 border border-gray-300",
        "transform-gpu"
      )}
      style={{
        width: normalizedPosition === 0 ? "360px" : "320px",
        height: normalizedPosition === 0 ? "340px" : "300px",
        opacity: Math.abs(normalizedPosition) > 2 ? 0 : 1 - Math.abs(normalizedPosition) * 0.2,
        zIndex: 20 - Math.abs(normalizedPosition),
        transform: `translateX(${normalizedPosition * 220}px) scale(${1 - Math.abs(normalizedPosition) * 0.1})`,
      }}
    >
      <div className="  rounded-full mb-4">
        <Image
          src={card.img}
          alt="Avatar"
          width={98}
          height={98}
          className="rounded-full  object-center bg-center shadow-md border-4 border-white object-cover"
        />
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
      <p className="text-gray-600 text-center">{card.description}</p>
    </div>
  );
})}

             </div>
     
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
           </div>
            {/* Audio Files */}
            <audio 
              ref={noisyAudioRef} 
              src="/originalvoice.mp3" 
              preload="auto"
            />

     
           {/* Play/Pause Button and Switch for main audio */}
           <div className="mt-8 flex items-center space-x-4 bg-white border mx-auto rounded-full h-16 w-[500px] justify-center">
             <button
               onClick={() => setIsPlaying(!isPlaying)}
               className="p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
               aria-label={isPlaying ? "Pause" : "Play"}
             >
               {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
             </button>
             <SwitchButton setIsGradient={setIsSwitchedOn} />
           </div>
           
       </div>

       <Button variant={"outline"} className=" mt-5"><Link href="/try-demo">Try Your Own</Link></Button>
       <RainbowButton><Link href="/try-demo">Try Your Own</Link></RainbowButton>

    

   </div>
  );
}
