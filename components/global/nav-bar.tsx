"use client";

import { Flex, Spinner } from "@radix-ui/themes";

import { condensed } from "@/app/fonts";
import { Link } from "next-view-transitions";
import { useSession } from "@/lib/auth/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Aurora from "@/components/bits/backgrounds/Aurora/Aurora";

const MotionFlex = motion.create(Flex);

export default function NavBar() {
  const { session, isLoading } = useSession();

  return (
    <nav className="top-0 left-0 z-50 w-full sticky transition-all duration-300 shadow-sm border-b-2 border-neutral-800 bg-neutral-800/20 h-24">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        className="inset-0 -z-10 absolute"
        blend={0.5}
        amplitude={5.0}
        speed={0.5}
      />

      <Flex
        justify="between"
        gap={{ initial: "4", sm: "6", md: "8" }}
        className="px-3 sm:px-4 md:px-6 rounded-md absolute inset-0 z-10 backdrop-blur-lg"
        align="center"
      >
        <Flex gap="4" align="center">
          <Link href="/" className="flex items-center gap-2">
            <p
              className={cn(
                "text-2xl font-bold text-neutral-900 dark:text-neutral-100",
                condensed.className
              )}
            >
              suave.
            </p>
          </Link>
        </Flex>

        <Flex
          gap="2"
          align="center"
          className="min-w-8 h-12 max-h-12 sm:max-w-32 md:max-w-48 s-nav-auth-action"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <MotionFlex
                gap="2"
                align="center"
                key={"loading"}
                exit={{ y: 20, opacity: 0 }}
              >
                <Spinner size="1" />
                <span className="text-sm hidden sm:inline">Entrando...</span>
              </MotionFlex>
            ) : session?.isLoggedIn ? (
              <Link href="/profile">
                <MotionFlex
                  gap="2"
                  align="center"
                  key={"logged"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Image
                    loading="eager"
                    src={
                      session?.passport?.knownInfo?.pictureUrl ||
                      "/no-picture.png"
                    }
                    width={32}
                    height={32}
                    alt="Profile Picture"
                    className="rounded-full w-8 h-8 sm:w-8 sm:h-8"
                  />
                  <span className="text-sm font-medium hidden sm:inline">
                    {session?.passport?.knownInfo?.firstName}
                  </span>
                </MotionFlex>
              </Link>
            ) : (
              <Link
                href="/session/start"
                className="px-2 py-1 text-sm sm:text-base rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                Entrar
              </Link>
            )}
          </AnimatePresence>
        </Flex>
      </Flex>
    </nav>
  );
}
