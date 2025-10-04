"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button } from "@radix-ui/themes";
import { condensed } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Heart, HeartCrack, ArrowRight, X } from "lucide-react";
import Image from "next/image";

export default function MigrationNotice() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCanceled, setIsCanceled] = useState(false);
  const [showHeartbreak, setShowHeartbreak] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const suave2Url = "https://suave.zesmoi.com.br?utm_source=suave1&utm_medium=migration&utm_campaign=suave1_deprecation&utm_content=migration_notice";

  useEffect(() => {
    if (isCanceled || redirecting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRedirecting(true);
          clearInterval(timer);
          // Redirect after showing heartbreak animation
          setTimeout(() => {
            window.location.href = suave2Url;
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show heartbreak animation halfway through
    const heartbreakTimer = setTimeout(() => {
      setShowHeartbreak(true);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(heartbreakTimer);
    };
  }, [isCanceled, redirecting]);

  const handleCancel = () => {
    setIsCanceled(true);
  };

  const handleGoToSuave2 = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = suave2Url;
    }, 1000);
  };

  if (redirecting) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-950 via-black to-purple-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center w-full px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <HeartCrack size={80} className="text-red-500 mx-auto" />
          </motion.div>
          <Text className={cn(condensed.className, "text-white")} size="6">
            Redirecionando para seu novo amor... 💔➡️❤️
          </Text>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-red-950 to-black overflow-hidden relative">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 w-full bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 w-full bg-[linear-gradient(45deg,transparent_40%,rgba(0,0,0,0.8)_50%,transparent_60%)]" />
      
      {/* Floating broken hearts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-500/20"
          initial={{ y: "100vh", x: Math.random() * 100 + "vw", rotate: 0 }}
          animate={{ 
            y: "-10vh", 
            rotate: 360,
            x: [null, Math.random() * 100 + "vw"]
          }}
          transition={{ 
            duration: 8 + i * 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 2
          }}
        >
          <HeartCrack size={24 + i * 4} />
        </motion.div>
      ))}

      <motion.div
        className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-8 text-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Dramatic title */}
        <motion.div
          className="mb-8"
          animate={{ 
            scale: showHeartbreak ? [1, 1.1, 1] : 1,
            textShadow: showHeartbreak ? "0 0 20px rgba(255,0,0,0.8)" : "none"
          }}
          transition={{ duration: 0.5, repeat: showHeartbreak ? Infinity : 0 }}
        >
          <Text 
            className={cn(condensed.className, "text-red-400 drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap")} 
          >
            💔 ABANDONO IMINENTE 💔
          </Text>
        </motion.div>

        {/* Logo transition */}
        <motion.div 
          className="mb-8 relative"
          animate={{ scale: showHeartbreak ? 0.9 : 1 }}
        >
          <Flex align="center" gap="4" className="mb-4">
            <motion.div
              animate={{ 
                x: showHeartbreak ? -50 : 0,
                opacity: showHeartbreak ? 0.5 : 1,
                filter: showHeartbreak ? "grayscale(100%)" : "none"
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="/favicon.ico" 
                alt="Suave 1 (abandonado)" 
                width={64} 
                height={64}
                className="rounded-lg"
              />
            </motion.div>
            
            <motion.div
              animate={{ scale: showHeartbreak ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: showHeartbreak ? Infinity : 0 }}
            >
              {showHeartbreak ? <HeartCrack size={32} className="text-red-500" /> : <ArrowRight size={32} className="text-gray-400" />}
            </motion.div>
            
            <motion.div
              animate={{ 
                x: showHeartbreak ? 50 : 0,
                scale: showHeartbreak ? 1.1 : 1,
                filter: showHeartbreak ? "brightness(1.2) saturate(1.5)" : "none"
              }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="https://suave.zesmoi.com.br/favicon.ico" 
                alt="Suave 2 (seu novo amor)" 
                width={64} 
                height={64}
                className="rounded-lg"
              />
            </motion.div>
          </Flex>
        </motion.div>

        {/* Dramatic message */}
        <motion.div 
          className="w-full max-w-4xl mb-8 px-4"
          animate={{ 
            color: showHeartbreak ? "#ef4444" : "#ffffff"
          }}
        >
          <Text className={cn(condensed.className)} size="6">
            Assim como sua ex que te deixou por alguém melhor, mais bonito e com mais dinheiro...
          </Text>
          
          <motion.div 
            className="mt-4"
            animate={{ scale: showHeartbreak ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: showHeartbreak ? Infinity : 0 }}
          >
            <Text className={cn(condensed.className)} size="5">
              O <span className="text-red-400 line-through">Suave 1</span> também está te abandonando! 😭
            </Text>
          </motion.div>

          <Text className={cn(condensed.className, "text-green-400 mt-4")} size="5">
            Mas hey! O <span className="text-yellow-400 font-bold">Suave 2</span> é tipo aquele crush que você sempre quis: 
            mais rápido, mais bonito, mais inteligente e não trava! ✨
          </Text>
        </motion.div>

        {/* Timer warning */}
        {!isCanceled && (
          <motion.div 
            className="mb-8 p-4 border-2 border-red-500 rounded-lg bg-red-950/50"
            animate={{ 
              borderColor: timeLeft <= 5 ? ["#ef4444", "#dc2626", "#ef4444"] : "#ef4444",
              scale: timeLeft <= 5 ? [1, 1.02, 1] : 1
            }}
            transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
          >
            <Text className={cn(condensed.className, "text-red-300")} size="4">
              ⚠️ ATENÇÃO: Em {timeLeft} segundos você será automaticamente redirecionado
            </Text>
            <Text className={cn(condensed.className, "text-gray-400")} size="3">
              (Assim como ela fez... sem avisar... numa quinta-feira... 💔)
            </Text>
          </motion.div>
        )}

        {/* Action buttons */}
        <Flex gap="4" direction={{ initial: "column", md: "row" }}>
          <Button
            size="4"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            onClick={handleGoToSuave2}
          >
            <Heart className="mr-2" size={20} />
            Aceitar meu novo amor ❤️
          </Button>
          
          {!isCanceled && timeLeft > 0 && (
            <Button
              size="4"
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
              onClick={handleCancel}
            >
              <X className="mr-2" size={20} />
              Cancelar (mas por quê? 😢)
            </Button>
          )}
        </Flex>

        {isCanceled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-gray-800 rounded-lg"
          >
            <Text className={cn(condensed.className, "text-yellow-400")} size="4">
              Ok, você cancelou... mas lembre-se: o Suave 1 não será mais suportado! 
            </Text>
            <Text className={cn(condensed.className, "text-gray-400")} size="3">
              É como tentar voltar com a ex... às vezes funciona, mas geralmente não 🤷‍♂️
            </Text>
            <Button
              size="3"
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={handleGoToSuave2}
            >
              Mudar de ideia e ir para o Suave 2
            </Button>
          </motion.div>
        )}

        {/* Fine print */}
        <Text className={cn(condensed.className, "text-gray-500 mt-8 w-full max-w-2xl px-4")} size="2">
          * O Suave 1 será descontinuado em breve. Todos os seus dados serão migrados automaticamente.
          Não se preocupe, é como mudar de casa, mas sem precisar carregar as caixas! 📦
        </Text>
      </motion.div>
    </div>
  );
}