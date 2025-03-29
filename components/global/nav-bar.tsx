"use client";

import { Flex, Heading, Spinner, Box } from "@radix-ui/themes";

import { condensed, dosis } from "@/app/fonts";
import { Link } from "next-view-transitions";
import { useSession } from "@/lib/auth/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  Wrench,
  BookOpen,
  BarChart,
  Heart,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const MotionFlex = motion.create(Flex);
const MotionBox = motion.create(Box);

export default function NavBar() {
  const { session, isLoading } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Inicio", href: "/", icon: <Home size={18} /> },
    {
      name: "Ferramentas",
      icon: <Wrench size={18} />,
      children: [
        {
          name: "Ver moodles disponíveis",
          href: "/ead/available",
          icon: <BookOpen size={18} />,
        },
        {
          name: "Performance academica",
          href: "/academic/performance",
          icon: <BarChart size={18} />,
        },
      ],
    },
    { name: "Contribua", href: "/contribuite", icon: <Heart size={18} /> },
  ];

  return (
    <nav className="top-0 left-0 z-50 w-full sticky backdrop-blur-lg backdrop-filter transition-all duration-300 py-2 shadow-sm border-b-2 border-neutral-800">
      <Flex
        justify="between"
        gap={{ initial: "4", sm: "6", md: "8" }}
        className="px-3 sm:px-4 md:px-6 rounded-md"
        align="center"
      >
        <Flex gap="4" align="center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu size={24} />
          </button>

          <Link href="/">
            <Heading
              as="h1"
              size={{ initial: "6", sm: "7", md: "8" }}
              className={dosis.className}
            >
              suave.
            </Heading>
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

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <MotionFlex
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-64 h-[95vh] bg-white dark:bg-neutral-900 z-50 flex-col shadow-lg overflow-hidden rounded-md m-4"
            >
              <Flex
                justify="between"
                align="center"
                p="4"
                className="border-b sticky top-0 bg-white dark:bg-neutral-900 z-10"
              >
                <Heading as="h2" size="6" className={dosis.className}>
                  Suave
                </Heading>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </Flex>

              <Flex direction="column" className="flex-1 overflow-y-auto py-4">
                <Flex direction="column" className="space-y-2">
                  {navItems.map((item) =>
                    item.children ? (
                      <Flex
                        key={item.name}
                        direction="column"
                        className="px-4 gap-1"
                      >
                        <Flex align="center" gap="2" className="font-medium">
                          {item.icon}
                          <span>{item.name}</span>
                        </Flex>
                        <Flex direction="column" className="pl-6 gap-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setIsSidebarOpen(false)}
                              className="text-sm py-1 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-2"
                            >
                              {child.icon}
                              {child.name}
                            </Link>
                          ))}
                        </Flex>
                      </Flex>
                    ) : (
                      <Box key={item.href} className="px-4">
                        <Link
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className="py-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-2"
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      </Box>
                    )
                  )}
                </Flex>
              </Flex>

              <Flex
                direction="column"
                className="border-t p-4 sticky bottom-0 bg-white dark:bg-neutral-900 z-10"
              >
                <Link
                  href="/contribuite"
                  onClick={() => setIsSidebarOpen(false)}
                  className="font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-2"
                >
                  <Heart size={18} />
                  Contribua
                </Link>
              </Flex>
            </MotionFlex>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
