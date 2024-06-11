"use client"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function Footer() {
    const [color,setColor] = useState("green")
    
    
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Toggle between colors
      setColor(prevColor => prevColor === "blank" ? "green" : "blank");
    }, 500); // Interval time set to 500 milliseconds

    // Clean up the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs after every render
  
    return (
        <footer className="w-full">
            <section className="flex justify-end items-center">
             {/* for this render accoding to session if user logged in then show green blink light and logged in and if session not logged in the show Offline and continuos red light */}
             <Badge className="mr-2">Logged In</Badge>
             <div className={`bg-${color}-500 rounded-full w-4 h-4`}></div>
            </section>
        </footer>
    )
}