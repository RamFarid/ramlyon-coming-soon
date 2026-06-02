import { ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function WaitlistCard({ t, lang }: { t: any, lang: string }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Check if the user already joined on this device
    const joined = localStorage.getItem("waitlist_joined");
    if (joined) {
      setHasJoined(true);
      setStatus("success");
    }
  }, []);

  const getDeviceId = () => {
    let devId = localStorage.getItem("device_id");
    if (!devId) {
      devId = crypto.randomUUID();
      localStorage.setItem("device_id", devId);
    }
    return devId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting || hasJoined) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          deviceId: getDeviceId(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      setStatus("success");
      setHasJoined(true);
      localStorage.setItem("waitlist_joined", "true");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent relative z-10 overflow-hidden shadow-2xl">
      <div className="bg-[#0A0A0A]/95 backdrop-blur-xl rounded-[23px] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 h-full">
         
         {/* English Helper Text */}
         <div className="w-full lg:w-1/4 text-center lg:text-left hidden md:block" dir="ltr">
           <h3 className="text-white font-semibold mb-1.5 text-[15px]">{t.beFirst}</h3>
           <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-[200px]">{t.joinDesc}</p>
         </div>

         {/* Email Input Form */}
         <div className="flex-1 w-full max-w-lg mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
           {status === "success" ? (
             <div className="flex flex-col items-center justify-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
               <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
               <p className="text-green-400 font-medium text-center">
                 {lang === 'ar' ? 'شكراً لك! لقد تمت إضافتك إلى قائمة الانتظار.' : 'Thank you! You have been added to the waitlist.'}
               </p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="flex flex-col gap-2">
               <div className="flex p-1.5 bg-[#121212] border border-white/10 rounded-xl focus-within:border-red-500/30 transition-colors shadow-inner">
                  <input 
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     disabled={isSubmitting || hasJoined}
                     placeholder={t.placeholder}
                     className="flex-1 w-full min-w-0 bg-transparent border-none outline-none text-white px-4 text-[15px] placeholder:text-zinc-500 disabled:opacity-50"
                  />
                  <button 
                     type="submit" 
                     disabled={isSubmitting || hasJoined || !email}
                     className="flex items-center justify-center whitespace-nowrap gap-2 bg-[#E11D25] hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:shadow-none"
                  >
                     {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <>
                          {t.button}
                          {lang === 'ar' ? <ArrowLeft className="w-4 h-4 ml-1" /> : <ArrowRight className="w-4 h-4 ml-1" />}
                        </>
                     )}
                  </button>
               </div>
               {status === "error" && (
                 <p className="text-red-400 text-sm mt-1 mx-2">{errorMessage}</p>
               )}
             </form>
           )}
         </div>

         {/* Divider */}
         <div className="hidden lg:block w-px h-[72px] bg-white/10" />

         {/* Arabic Helper Text */}
         <div className="w-full lg:w-1/4 text-center lg:text-right hidden md:block" dir="rtl">
           <h3 className="text-white font-semibold mb-1.5 text-[15px]">{t.beFirstAr}</h3>
           <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-[200px] mr-auto">{t.joinDescAr}</p>
         </div>
         
         {/* Mobile visible texts */}
         <div className="md:hidden w-full text-center mt-2 flex flex-col gap-4">
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <h3 className="text-white font-semibold mb-1">{lang === 'ar' ? t.beFirstAr : t.beFirst}</h3>
               <p className="text-zinc-400 text-xs leading-relaxed">{lang === 'ar' ? t.joinDescAr : t.joinDesc}</p>
            </div>
         </div>

      </div>
    </div>
  )
}
