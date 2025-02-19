import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD || "sLQWM6Jf;2ep75rN8-(Vm]Ak+PjK<*Zw\n",
    cookieName: "X-Suave-Session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};