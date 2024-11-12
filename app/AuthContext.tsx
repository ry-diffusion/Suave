"use client";

import { useState, createContext, useEffect } from "react";

export const REVISION = 0x1;
export type KnownInfo = {
    revision: number,
    firstName: string,
    fullName: string,
    pictureUrl: string | null,
}

export type Passport = {
    username: string,
    password: string,
    moodleToken: string,
    suapToken: string | null,
    knownInfo: KnownInfo | null
};

export type AuthManager = {
    authenticate: (data: Passport) => void,
    updateKnownInfo: (knownInfo: KnownInfo | null) => void,
    logout: () => void,
    passport: Passport | null
}

export const AuthContext = createContext<AuthManager | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [passport, setPassport] = useState<Passport | null>(null)


    useEffect(() => {
        if (typeof window == "undefined") return;
        if (window.localStorage.getItem('Passport.LoggedIn') && !passport) {
            const rawKnownInfo = window.localStorage.getItem('Passport.Knowninfo')
            setPassport({
                username: window.localStorage.getItem('Passport.user')!,
                password: window.localStorage.getItem('Passport.password')!,
                suapToken: window.localStorage.getItem('SUAP.token')!,
                moodleToken: window.localStorage.getItem('Moodle.token')!,
                knownInfo: rawKnownInfo ? JSON.parse(rawKnownInfo) : null,
            })
        }
    }, [passport, setPassport]);

    const authenticate = (data: Passport) => {
        setPassport(data)

        if (typeof window !== "undefined") {
            window.localStorage.setItem('Passport.user', data.username)
            window.localStorage.setItem('Passport.password', data.password)
            window.localStorage.setItem('Moodle.token', data.moodleToken)
            window.localStorage.setItem('Passport.LoggedIn', 'YES');
            if (data.suapToken)
                window.localStorage.setItem('SUAP.Token', data.suapToken)
        }
    }

    const updateKnownInfo = (knownInfo: KnownInfo | null) => {
        if (!passport)
            throw new Error('User is not logged in.')

        if (typeof window !== "undefined")
            window.localStorage.setItem('Passport.Knowninfo', JSON.stringify(knownInfo))

        setPassport({
            ...passport,
            knownInfo
        })
    }

    const logout = () => {
        updateKnownInfo(null)
        setPassport(null)
        window.localStorage.clear()
    }

    return <AuthContext.Provider value={{ passport, logout, authenticate, updateKnownInfo }}>{children}</AuthContext.Provider>;
};