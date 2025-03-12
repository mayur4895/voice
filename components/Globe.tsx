"use client"
import Link from "next/link";
import { Globe } from "./magicui/globe"; 
import { RainButton } from "./rainbow-button";
import { Button } from "./ui/button";

export function GlobeAnimation() {
  return (
    <div className="relative flex size-full  h-[88vh] items-center justify-center  overflow-hidden  rounded-lg   bg-background px-40 pb-40 pt-40 md:pb-60">
     <div className=" flex flex-col text-center items-center">
     <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Voice Like a Magic  
      </span> 
       <Button className="w-[150px] z-50 mt-5 "> <Link href={"/try-demo"}>Try Demo</Link></Button> 
     </div>
      <Globe className="top-48" />
     
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  );
}
