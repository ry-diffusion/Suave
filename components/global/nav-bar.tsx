"use client";

import { Flex, Link, Spinner } from "@radix-ui/themes";

import { condensed } from "@/app/fonts";
import { useSession } from "@/lib/auth/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Aurora = dynamic(
  () => import("@/components/bits/backgrounds/Aurora/Aurora"),
  { ssr: false }
);

const MotionFlex = motion.create(Flex);

export default function NavBar() {
  const { session, isLoading } = useSession();

  return (
    <nav className="top-0 left-0 z-50 w-full sticky transition-all duration-300 shadow-sm border-b-2 border-[var(--gray-6)] bg-[var(--gray-1)]/20 h-24 max-w-[100vw] backdrop-blur-lg">
      <Aurora
        colorStops={["#33AAFF", "#00FFB4", "#DDEEDD"]}
        className="inset-0 -z-10 absolute max-w-[50vw]"
        blend={1.0}
        amplitude={0.5}
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
