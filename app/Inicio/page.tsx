import Link from "next/link";
import Content from "../components/Content";
import UrlLink from "./Button";
import SuaveTitle from "../components/SuaveTitle";

export default function Inicio() {
    return <Content>
        <SuaveTitle />
        <h1> Suavão fi? O quê você quer fazer hoje? </h1>

        <UrlLink url="/MoodlesDisponiveis" className="bg-yellow-200">
            Ver os moodles disponíveis
        </UrlLink>
    </Content>
}