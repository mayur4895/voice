'use client'
import { GlobeAnimation } from "@/components/Globe";
import Header from "@/components/Header";
import { RainButton } from "@/components/rainbow-button";
import { Button } from "@/components/ui/button";
 
export default function Home() {
  return (
   
 <>
 
          
       <div className=" flex items-center w-full flex-col">
        <Header/>
       <GlobeAnimation/>
       
       </div>
 </>
   
  );
}
