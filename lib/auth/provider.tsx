"use client";

import React from "react";
import {AuthContext} from "@/lib/auth/context";
import {SessionData} from "@/types/session-data";

export default function AuthProvider({children, ...sessionData}: {
    children: React.ReactNode | React.ReactNode[]
} & SessionData) {
    return (
        <AuthContext.Provider value={sessionData}>
            {children}
        </AuthContext.Provider>
    );
}