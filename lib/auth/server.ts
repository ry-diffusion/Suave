import {getIronSession} from "iron-session";
import {sessionOptions} from "@/config/auth";
import {SessionData} from "@/types/session-data";


export async function getSession() {
    const { cookies } = await import("next/headers");
    return await getIronSession<SessionData>(await cookies(), sessionOptions);
}

