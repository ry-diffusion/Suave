import Content from "@/components/Content";
import UrlLink from "./Button";
import SuaveTitle from "@/components/SuaveTitle";
import Image from "next/image";

export default function Inicio() {
    return <Content>

        <SuaveTitle />
        <h1> Suavão fi? O quê você quer fazer hoje? </h1>

        <div className="grid gap-8">
            <UrlLink url="/MoodlesDisponiveis" className="bg-yellow-200">
                <Image src="/moodle.svg" alt="Logo do Moodle" width={20} height={20} />
                Ver os moodles disponíveis
            </UrlLink>

            <UrlLink url="/DesempenhoAcademico" className="bg-blue-200">
                <Image src="/grade-a.svg" alt="Logo do Moodle" width={20} height={20} />
                Analisar o desempenho acadêmico
            </UrlLink>


            <UrlLink url="https://nubank.com.br/cobrar/jk28o/67331f9e-cafa-416c-b3ef-bb0ca933c88e" className="bg-purple-200">
                <Image src="/pix.svg" alt="Pix" width={20} height={20} />
                Seja um contribuinte do Suave
            </UrlLink>
        </div>
    </Content>
}