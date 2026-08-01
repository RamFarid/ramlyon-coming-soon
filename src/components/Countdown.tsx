import { useState, useEffect } from 'react';

export function Countdown({ t }: { t: any }) {
  const [timeLeft, setTimeLeft] = useState(() => {
  const targetDate = new Date("2026-08-15");
  const now = new Date();
  
  // Calculate the total difference in milliseconds
  const totalMs = targetDate.getTime() - now.getTime();
  
  // If the date has already passed, return zeros
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // Time calculations for days, hours, minutes, and seconds
  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  
  return { days, hours, minutes, seconds };
});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-4 font-sans text-center z-10 relative" dir="ltr">
       <TimeUnit value={timeLeft.days} label={t.days} />
       <Colon />
       <TimeUnit value={timeLeft.hours} label={t.hours} />
       <Colon />
       <TimeUnit value={timeLeft.minutes} label={t.minutes} />
       <Colon />
       <TimeUnit value={timeLeft.seconds} label={t.seconds} />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-[72px] sm:w-[100px] h-24 sm:h-28 bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
      <span className="text-3xl sm:text-5xl font-semibold text-[#FF2D2D] tracking-tight" style={{ textShadow: '0 0 15px rgba(220,38,38,0.3)' }}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-widest text-zinc-400 mt-2 sm:mt-3 uppercase">
        {label}
      </span>
    </div>
  )
}

function Colon() {
   return <div className="text-xl sm:text-3xl font-bold text-red-600/40 pb-5 hidden sm:block">:</div>
}
