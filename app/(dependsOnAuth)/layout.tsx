import {ServerSessionProvider} from "@/lib/auth/server-auth-required";
import Content from "@/components/Content";
import React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    return <ServerSessionProvider>
        <Content>
            {children}
        </Content>
    </ServerSessionProvider>
}