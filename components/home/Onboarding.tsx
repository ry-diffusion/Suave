"use client"

import Image from "next/image";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { TrendingUp, Award, BarChart4 } from "lucide-react";
import { motion } from "framer-motion";
import { SessionData } from "@/types/session-data";
import { Text, Spinner } from "@radix-ui/themes";
import { condensed } from "@/app/fonts";


// // Welcome Section Component
// function WelcomeSection({ session, isLoading }: { session?: SessionData, isLoading: boolean }) {
//     const MotionLink = motion(Link)
//     return (
//         <div
//             id="welcome"
//             className="flex flex-col gap-9 justify-center items-center w-full py-64 h-full flex-1"
//         >
//             <motion.h1
//                 className={cn(
//                     "text-2xl md:text-4xl lg:text-8xl uppercase md:tracking-wide text-transparent text-center x-outline bg-clip-text bg-linear-90 from-blue-200/50 to-blue-100/50"
//                 )}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//             >
//                 Ei <span>{session?.passport?.knownInfo?.firstName}</span> Que tal deixar seu Ensino Médio um pouco mais <i>Suave</i> ?
//             </motion.h1>

//             {isLoading &&
//                 <motion.div className="text-xl flex flex-rol gap-4 items-center">
//                     <Spinner />
//                     <p>Iniciando sessão...</p>
//                 </motion.div>
//             }

//             {!session?.isLoggedIn && !isLoading &&
//                 <MotionLink className="rounded-full px-8 py-4 border-2 border-blue-200 bg-blue-800/10 backdrop-blur-3xl"
//                     href="/session/start"
//                     initial={{ opacity: 0, scale: 0 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     viewport={{ once: true }}
//                     whileHover={{ scale: 1.2, cursor: 'pointer' }}
//                 >
//                     Vamos começar!
//                 </MotionLink>
//             }


            
//         </div>
//     );
// }


export default function OnBoarding() {
    const { session, isLoading } = useSession();

    return (
        <div className="flex flex-col items-center">
            <Text className={condensed.className} size="8">Olá, {session?.passport?.knownInfo?.firstName}!</Text>
        </div>
    );
}