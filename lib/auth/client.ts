"use client";
import "client-only";

import {SessionData} from "@/types/session-data";

import {fetchJson, fetchNativeJSON} from "../fetchers";
import {useMutation, useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {queryClient} from "../query";
import {Institution} from "@/Support/Institutions";

const sessionApiRoute = process.env.NODE_ENV === "development" ? "http://localhost:3000/session" : "https://suave-one.vercel.app/session";

export type AuthPair = {
    username: string,
    password: string,
    institution: Institution
}

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

export function useSuspenseSession() {
    const {data} = useSuspenseQuery(
        {
            queryKey: ['session'],
            queryFn: () => fetchJson<SessionData>(sessionApiRoute),
        },
    );

    const triggerLogin = useMutation({
        mutationFn: (authPair: AuthPair) => doLogin(sessionApiRoute, authPair),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['session']
            });
        }
    });

    const triggerLogout = useMutation({
        mutationFn: () => doLogout(sessionApiRoute),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['session']
            });
        }
    });

    async function login(authPair: AuthPair) {
        await triggerLogin.mutateAsync(authPair);

        console.log("%c[Auth] %cSuccessfully authenticated with API.", "color: #ff00ff", "color: #ffffff");
    }

    async function logout() {
        console.log("%c[Auth] %cLogging out...", "color: #ff00ff", "color: #ffffff");

        await triggerLogout.mutateAsync();
    }


    return {session: data, logout, login};
}

export function useSession() {
    const {data, isLoading} = useQuery(
        {
            queryKey: ['session'],
            queryFn: () => fetchJson<SessionData>(sessionApiRoute),
        },
    );


    const triggerLogin = useMutation({
        mutationFn: (arg: AuthPair) => doLogin(sessionApiRoute, arg),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['session']
            });
        }
    });

    const triggerLogout = useMutation({
        mutationFn: () => doLogout(sessionApiRoute),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['session']
            });
        }
    });

    async function login(arg: AuthPair) {
        await triggerLogin.mutateAsync(arg);

        console.log("%c[Auth] %cSuccessfully authenticated with Discord.", "color: #ff00ff", "color: #ffffff");
    }

    async function logout() {
        console.log("%c[Auth] %cLogging out...", "color: #ff00ff", "color: #ffffff");

        await triggerLogout.mutateAsync();
    }


    return {session: data, logout, login, isLoading};
}