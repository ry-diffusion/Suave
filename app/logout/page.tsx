"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import SuaveTitle from "../components/SuaveTitle";
import Loading from "../components/Loading";
import Link from "next/link";

export default function Logout() {
    const { logout } = useContext(AuthContext)!;

    useEffect(() => {
        logout();
    }, [logout]);


    return <div className="items-center justify-items-center min-h-screen">
        <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <SuaveTitle />

                <Loading message="Saindo..." />
                <p> Você será redirecionado para a página inicial em instantes. </p>
                <p> Se não for redirecionado, clique <Link href="/" className="text-red-200">aqui</Link>. </p>

                <meta httpEquiv="refresh" content="1;url=/" />
            </main>
        </div>
    </div>
}