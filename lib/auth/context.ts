import React from 'react';
import {SessionData} from "@/types/session-data";

export const AuthContext = React.createContext<SessionData | null>(null);

export function useAuth() {
    const context = React.use(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

