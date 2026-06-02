import { useState } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { Badge } from "./components/Badge";
import { WaitlistCard } from "./components/WaitlistCard";
import { Countdown } from "./components/Countdown";
import { translations, Lang } from "./translations";

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  return (
    <div className="relative min-h-screen mb-0 flex flex-col items-center justify-center overflow-x-hidden bg-[#020202] selection:bg-red-500/30 font-sans text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <BackgroundEffects />
      
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-center items-center z-50">
        <div className="flex items-center bg-zinc-900/60 backdrop-blur-xl rounded-full p-1 border border-white/10" dir="ltr">
          <button 
            onClick={() => setLang('en')} 
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${lang === 'en' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> EN
          </button>
          <button 
            onClick={() => setLang('ar')} 
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${lang === 'ar' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            العربية
          </button>
        </div>
      </header>

      <main className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 z-10 flex flex-col items-center flex-1 justify-center min-h-screen pt-24 sm:pt-32 pb-16">
          
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="w-full flex flex-col items-center"
        >
          {/* Badge */}
           <div className="mb-6 sm:mb-8">
             <Badge text={t.comingSoon} />
           </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-bold text-center mb-6 tracking-tight leading-[1.1]">
            <span className="text-[#E11D25] drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">{t.headlinePart1}</span>
            {t.headlinePart2}
            <span className="text-[#E11D25]">{t.headlinePart3}</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-center text-zinc-400 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-12 sm:mb-16">
            {t.description}
          </p>

          {/* Countdown timer */}
          <div className="mb-16 md:mb-24 px-2 overflow-x-hidden w-full flex justify-center">
             <Countdown t={t} />
          </div>

          {/* Waitlist Card */}
          <div className="w-full max-w-5xl">
            <WaitlistCard t={t} lang={lang} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
