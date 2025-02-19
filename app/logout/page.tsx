"use client";

import {useEffect} from "react";
import SuaveTitle from "@/components/SuaveTitle";
import Loading from "@/components/Loading";
import Link from "next/link";
import Content from "@/components/Content";
import {useSession} from "@/lib/auth/client";

export default function Logout() {
    const {logout} = useSession();


    useEffect(() => {
        logout();
    }, [logout]);

    return <Content>
        <SuaveTitle/>

        <Loading message="Saindo..."/>
        <p> Você será redirecionado para a página inicial em instantes. </p>
        <p> Se não for redirecionado, clique <Link href="/" className="text-red-200">aqui</Link>. </p>

        <meta httpEquiv="refresh" content="3;url=/"/>
    </Content>
}