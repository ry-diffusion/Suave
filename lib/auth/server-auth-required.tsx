import {getSession} from "@/lib/auth/server";
import {redirect} from "next/navigation";
import React from "react";
import AuthProvider from "@/lib/auth/provider";

export async function ServerSessionProvider({children}: {
    children: React.ReactNode | React.ReactNode[]
}) {
    const session = await getSession()

    if (!session.isLoggedIn && !session.passport) {
        return redirect("/")
    }

    return <AuthProvider {...session}>{children}</AuthProvider>

}