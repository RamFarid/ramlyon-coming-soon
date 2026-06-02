import { motion } from "motion/react";

export function Badge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center justify-center gap-2.5 px-4 py-[6px] rounded-full border border-red-500/20 bg-red-500/5 mx-auto">
      <div className="relative flex items-center justify-center w-2 h-2">
        <div className="absolute inset-0 rounded-full bg-red-500 opacity-60" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        <div className="absolute w-[6px] h-[6px] rounded-full bg-[#E11D25] drop-shadow-[0_0_6px_rgba(239,68,68,1)]" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
        {text}
      </span>
    </div>
  );
}
