"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import SwitchButton from "@/components/SwitchButton"
import WaveAnimation from "@/components/Hallofwaves"
import axios from "axios"

export default function Demo() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false)
  const [isSwitchedOnRecorded, setIsSwitchedOnRecorded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [latestText, setLatestText] = useState("")
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(null)
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string>("")
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false);

  const cards = [
    { id: 1, title: "US Female (Aria)", description: "Experience a natural and clear US female voice.", img: "/ukrain.jpg", apiEndPoint: "/play-aria" },
    { id: 2, title: "British Male (Ryan)", description: "Enjoy a rich and powerful British male voice.", img: "/usmale.jpg", apiEndPoint: "/play-ryan" },
    { id: 3, title: "Australian Female (Natasha)", description: "Experience a smooth and professional Australian female voice.", img: "/natasha.jpg", apiEndPoint: "/play-natasha" },
    { id: 4, title: "US Female (Jenny)", description: "A warm and friendly US female voice for any occasion.", img: "/jenny.jpg", apiEndPoint: "/play-jenny" },
    { id: 5, title: "British Female (Libby)", description: "A refined and elegant British female voice.", img: "/libby.jpg", apiEndPoint: "/play-libby" },
    { id: 6, title: "Canadian Male (Liam)", description: "A deep and engaging Canadian male voice.", img: "/canadianmale.jpg", apiEndPoint: "/play-liam" }
  ];

  // Handle audio end for recorded audio
  useEffect(() => {
    const handleRecordedAudioEnd = () => setIsPlayingRecorded(false);

    if (recordedAudio) {
      recordedAudio.addEventListener('ended', handleRecordedAudioEnd);
    }

    return () => {
      if (recordedAudio) {
        recordedAudio.removeEventListener('ended', handleRecordedAudioEnd);
      }
    };
  }, [recordedAudio]);

  // Handle recorded audio playback
  useEffect(() => {
    setIsLoading(true);
    const playAudio = async (url: string) => {
      if (!url) {
        console.error("No audio URL provided");
        return;
      }

      // Stop and reset existing audio
      if (recordedAudio) {
        recordedAudio.pause();
        recordedAudio.currentTime = 0;
      }

      // Create new audio element with cache-busting timestamp
      const newAudio = new Audio(`${url}?t=${Date.now()}`);
      
      try {
        await newAudio.play();
        setRecordedAudio(newAudio);
      } catch (error) {
        console.error("Playback failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isPlayingRecorded) {
      if (isSwitchedOnRecorded) {
        // Play generated voice
        axios.post(`http://localhost:8000${cards[selectedIndex]?.apiEndPoint}`)
          .then(response => {
            const generatedUrl = `http://localhost:8000${response.data.generated_file}`;
            playAudio(generatedUrl);
          })
          .catch(console.error);
      } else {
        // Play original recording with cache-busting
        if (originalAudioUrl) playAudio(originalAudioUrl);
      }
    } else {
      recordedAudio?.pause();
    }
  }, [isPlayingRecorded, isSwitchedOnRecorded, selectedIndex, originalAudioUrl]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setOriginalAudioUrl(""); // Reset previous audio URL
      await axios.post("http://localhost:8000/start-recording");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const response = await axios.post("http://localhost:8000/stop-recording");
      setLatestText(response.data.recognized_text);
      
      // Add cache-busting parameter to URL
      const newAudioUrl = `http://localhost:8000${response.data.original_audio}?t=${Date.now()}`;
      setOriginalAudioUrl(newAudioUrl);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 z-50">
        <WaveAnimation isGradient={isSwitchedOnRecorded} />

        {/* Card carousel */}
        <div className="relative w-full overflow-hidden px-4 items-center">
          <div className="flex items-center justify-center h-80">
            {cards.map((card, index) => {
              const position = (index - selectedIndex + cards.length) % cards.length;
              const normalizedPosition = position > 2 ? position - cards.length : position;

              return (
                <div
                  key={card.id}
                  className={cn(
                    "absolute flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out",
                    "bg-white border border-slate-200",
                    "transform-gpu",
                  )}
                  style={{
                    width: normalizedPosition === 0 ? "340px" : "300px",
                    height: normalizedPosition === 0 ? "320px" : "280px",
                    opacity: Math.abs(normalizedPosition) > 2 ? 0 : 1 - Math.abs(normalizedPosition) * 0,
                    zIndex: 20 - Math.abs(normalizedPosition),
                    transform: `translateX(${normalizedPosition * 220}px) scale(${1 - Math.abs(normalizedPosition) * 0.1})`,
                  }}
                >
                  <Image src={card.img} alt={"img"} width={100} height={100} className="p-2 rounded-full bg-contain bg-center" />
                  <h3 className=" font-bold text-slate-800 mb-2">{card.title}</h3>
                  <p className="text-slate-600 text-center">{card.description}</p>
                </div>
              );
            })}
          </div>

          {/* Left Button */}
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
                  setIsAnimating(true);
                  setSelectedIndex(index);
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

        <div className="mt-8 flex items-center space-x-4 bg-white border mx-auto rounded-full h-16 w-[500px] justify-center">
          <button
            onClick={() => setIsPlayingRecorded(!isPlayingRecorded)}
            className="p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            aria-label={isPlayingRecorded ? "Pause" : "Play"}
          >
            {isPlayingRecorded ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <SwitchButton setIsGradient={setIsSwitchedOnRecorded} />
        </div>

        {/* Recording Button Logic */}
        <div className="flex space-x-4 mt-8 px-5 bg-white w-80 h-16 rounded-full items-center justify-center">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="p-3 bg-green-600 text-white rounded shadow-md transition-colors duration-200"
            >
              Try Your Own Voice
            </Button>
          ) : (
            <>
              <Button
                onClick={stopRecording}
                className="p-3 bg-red-600 text-white rounded shadow-md transition-colors duration-200"
              >
                Stop Recording
              </Button>
              <span className="text-sm text-gray-600">Recording...</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}