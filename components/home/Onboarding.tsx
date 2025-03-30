"use client";

import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { TrendingUp, Award, TagsIcon, StarIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Text, Flex, Button } from "@radix-ui/themes";
import { condensed } from "@/app/fonts";
import React from "react";
import Link from "next/link";

function Element({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="rounded-full bg-blue-200/10 p-4">{icon}</div>

      <Button asChild>
        <Link href={href ?? "#"}>
          <Text className={condensed.className} size="5">
            {title}
          </Text>
        </Link>
      </Button>

      <Text className="text-center text-neutral-500 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {description}
      </Text>
    </div>
  );
}

export default function OnBoarding() {
  const { session, isLoading } = useSession();
  const MotionFlex = motion.create(Flex);

  const [greeting, setGreeting] = React.useState<string>("Olá");

  // bora botar o bgl para se tiver de manhã: Bom dia
  // se tiver de tarde: Boa tarde
  // se tiver de noite: Boa noite
  // se tiver de madrugada: Eita, tá tarde não? Que tal dormir?
  // KKKKKKK, por quê não?
  // ~Moizes
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) {
      setGreeting("Eita, tá tarde não? Que tal dormir?");
    } else if (hour < 12) {
      setGreeting("Bom dia,");
    } else if (hour < 18) {
      setGreeting("Boa tarde,");
    } else {
      setGreeting("Boa noite,");
    }
  }, []);

  return (
    <Flex className="items-center my-4 md:my-32" gap="8" direction="column">
      <Text
        className={cn(
          condensed.className,
          "text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        )}
        size="8"
      >
        {greeting} {session?.passport?.knownInfo?.firstName ?? "Desconhecido"}!
      </Text>
      <AnimatePresence>
        {session?.isLoggedIn && (
          <MotionFlex
            gap="6"
            align="center"
            direction="column"
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MotionFlex
              gap="6"
              align="center"
              direction={{ initial: "column", md: "row" }}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Element
                icon={<TrendingUp />}
                href="/academic/performance"
                title="Acompanhe seu desempenho"
                description="Veja como você está se saindo nas suas disciplinas e tire suas dúvidas."
              />

              <Element
                icon={<TagsIcon />}
                href="/ead/available"
                title="Veja as tarefas disponíveis"
                description="Veja as tarefas disponíveis para você e suas notas."
              />
            </MotionFlex>

            <MotionFlex
              gap="6"
              align="center"
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Element
                icon={<StarIcon />}
                href="https://nubank.com.br/cobrar/jk28o/67331f9e-cafa-416c-b3ef-bb0ca933c88e"
                title="Ajude o projeto"
                description="Ajude o projeto a crescer e se tornar mais forte."
              />
            </MotionFlex>
          </MotionFlex>
        )}

        {!session?.isLoggedIn && !isLoading && (
          <MotionFlex
            gap="6"
            align="center"
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Element
              icon={<Award />}
              href="/session/start"
              title="Vamos começar!"
              description="Entre com sua instituição e faça seu login."
            />
          </MotionFlex>
        )}
      </AnimatePresence>
    </Flex>
  );
}
