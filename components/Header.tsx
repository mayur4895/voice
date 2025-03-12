"use client"

import { Home, Info, Phone, FileText, BookOpen, } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import Link from "next/link"
 

export default function Header() { 
  const navMenu = [
    {
      label: "Home",
      icon: <Home className="h-4 w-4" />,
      href:""
    },
    {
      label: "About",
      icon: <Info className="h-4 w-4" />,
      href:""
    },
    {
      label: "Contact",
      icon: <Phone className="h-4 w-4" />,
    },
    {
      label: "Services",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Blog",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ]

  
  return (
    <header className="     pt-12 rounded-full mx-auto px-4 py-2 ">
      <div className="bg-primary text-primary-foreground h-14  gap-10  rounded-4xl shadow-md flex items-center justify-between px-6">
        <div className="font-bold text-lg mr-20 w-12">Anshika</div>

        {/* Desktop Navigation */}
        <nav className="  ml-10 flex items-center space-x-1">
          {navMenu.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 rounded-full hover:text-white bg-transparent hover:bg-transparent  "
            >
              {item.icon}
              <Link href="#" className=" cursor-default">{item.label}</Link>
            </Button>
          ))}
        </nav>
 </div>
       
    </header>
  )
}

