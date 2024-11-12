"use client";

import { useState, createContext, useContext, useEffect } from "react";

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
    const [passport, setPassport] = useState<Passport | null>(null);


    const authenticate = (data: Passport) => {
        setPassport(data);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('Passport.user', data.username);
            window.localStorage.setItem('Passport.password', data.password);
            window.localStorage.setItem('Moodle.token', data.moodleToken);
            window.localStorage.setItem('Passport.LoggedIn', 'YES');
            if (data.suapToken) {
                window.localStorage.setItem('SUAP.Token', data.suapToken);
            }
        }
    };

    const updateKnownInfo = (knownInfo: KnownInfo | null) => {
        if (!passport) throw new Error('User is not logged in.');

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('Passport.Knowninfo', JSON.stringify(knownInfo));
        }

        setPassport({
            ...passport,
            knownInfo,
        });
    };

    const logout = () => {
        updateKnownInfo(null);
        setPassport(null);
        if (typeof window !== 'undefined') {
            window.localStorage.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ passport, logout, authenticate, updateKnownInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const usePassport = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('usePassport must be used within an AuthProvider');


    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage.getItem('Passport.LoggedIn') && !context.passport) {
            const rawKnownInfo = window.localStorage.getItem('Passport.Knowninfo');
            context.authenticate({
                username: window.localStorage.getItem('Passport.user')!,
                password: window.localStorage.getItem('Passport.password')!,
                suapToken: window.localStorage.getItem('SUAP.Token')!,
                moodleToken: window.localStorage.getItem('Moodle.token')!,
                knownInfo: rawKnownInfo ? JSON.parse(rawKnownInfo) : null,
            });
        }
    }, [context])

    return context;
}