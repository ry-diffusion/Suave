"use client";
import "client-only";

import { SessionData } from "@/types/session-data";

import { fetchJson, fetchNativeJSON } from "../fetchers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../query";
import { Institution, Providers } from "@/Support/Institutions";
import { useAuth } from "@/lib/auth/context";
import { handleLogin } from "@/lib/auth/actions";

const QUERY_KEY = ["user", "session"];

const sessionApiRoute =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/session"
    : "https://suave-one.vercel.app/session";

export type AuthPair = {
  username: string;
  password: string;
  institution: Institution;
};

function doLogin(url: string, authPair: AuthPair) {
  return fetchNativeJSON<SessionData>(url, {
    method: "POST",

    body: JSON.stringify(authPair),
    cache: "no-cache",
  });
}

function doLogout(url: string) {
  return fetchNativeJSON<SessionData>(url, {
    method: "DELETE",
  });
}

export function useSession() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => fetchJson<SessionData>(sessionApiRoute),
  });

  const triggerLogin = useMutation({
    mutationFn: (arg: AuthPair) => handleLogin(arg),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
      await queryClient.refetchQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const triggerLogout = useMutation({
    mutationFn: () => doLogout(sessionApiRoute),
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      }),
  });

  async function login(arg: AuthPair) {
    await triggerLogin.mutateAsync(arg);

    console.log(
      "%c[Auth] %cSuccessfully authenticated with API.",
      "color: #ff00ff",
      "color: #ffffff"
    );
  }

  async function logout() {
    console.log(
      "%c[Auth] %cLogging out...",
      "color: #ff00ff",
      "color: #ffffff"
    );

    await triggerLogout.mutateAsync();
  }

  return { session: data, logout, login, isLoading };
}

export const useMoodleBridge = () => {
  const { passport } = useAuth();
  if (!passport) throw new Error("User is not logged in.");
  const provider = Providers[passport.institution];
  if (!provider.moodle)
    throw new Error("Moodle is not supported by this institution.");
  return provider.moodle?.makeBridge(passport.moodleToken);
};

export const useProvider = () => {
  const { session } = useSession();
  if (!session?.isLoggedIn || !session.passport)
    throw new Error("User is not logged in.");

  return Providers[session.passport!.institution];
};
