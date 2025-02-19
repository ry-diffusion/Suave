import {ServerSessionProvider} from "@/lib/auth/server-auth-required";
import {Container} from "./contents"

export default async function AvailableEad() {
    return <ServerSessionProvider>
        <Container/>
    </ServerSessionProvider>
}