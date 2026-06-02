import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020202]">
      {/* Central top red arc */}
      <div 
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[180vw] sm:w-[120vw] md:w-[1400px] aspect-square rounded-full border-t-[1px] border-red-500/40"
        style={{
          boxShadow: "0 -20px 150px -10px rgba(220,38,38,0.2) inset, 0 -20px 150px -10px rgba(220,38,38,0.2)"
        }}
      />
      <div 
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[180vw] sm:w-[120vw] md:w-[1400px] aspect-square rounded-full border-t-[2px] border-red-600 blur-[8px] opacity-60"
      />
      <div 
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[180vw] sm:w-[120vw] md:w-[1400px] aspect-square rounded-full bg-gradient-to-b from-red-600/10 to-transparent blur-3xl opacity-40"
      />
    </div>
  );
}
