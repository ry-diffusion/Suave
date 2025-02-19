import MobileApi from "@/lib/moodle/MobileApi"
import SuapContext from "@/lib/suap/SuapContext"
import {HAS_MOODLE_SUPPORT, HAS_SUAP_SUPPORT} from "./FeatureFlags"
import {MoodleBridge} from "@/Bridge/MoodleBridge"
import SuapBridge from "@/Bridge/SuapBridge"

export interface MoodleProvider {
    api: MobileApi,
    makeBridge: (token: string) => MoodleBridge
}

export interface SuapProvider {
    api: SuapContext,
    makeBridge: (token: string) => SuapBridge
}

export interface Provider {
    moodle?: MoodleProvider,
    suap?: SuapProvider,

    features: string[]
}

export const Providers: Record<string, Provider> = {
    "Presencial IF Goiano": {
        features: [HAS_MOODLE_SUPPORT, HAS_SUAP_SUPPORT],
        moodle: {
            api: new MobileApi("https://presencial.ifgoiano.edu.br"),
            makeBridge: (token: string) => new MoodleBridge(token, "Presencial IF Goiano")
        },
        suap: {
            api: new SuapContext("https://suap.ifgoiano.edu.br"),
            makeBridge: (token: string) => new SuapBridge(token, "Presencial IF Goiano")
        }
    },

    "Cefet AVA": {
        features: [HAS_MOODLE_SUPPORT],
        moodle: {
            api: new MobileApi("https://ava.cefetmg.br"),
            makeBridge: (token: string) => new MoodleBridge(token, "Cefet AVA")
        }
    },

    "IF Paraná AVA": {
        features: [HAS_MOODLE_SUPPORT, HAS_SUAP_SUPPORT],
        moodle: {
            api: new MobileApi("https://ava.ifpr.edu.br"),
            makeBridge: (token: string) => new MoodleBridge(token, "IF Paraná AVA")
        },
        suap: {
            api: new SuapContext("https://suap.ifpr.edu.br"),
            makeBridge: (token: string) => new SuapBridge(token, "IF Paraná AVA")
        }
    }
}

export type Institution = keyof typeof Providers

export function moodleByName(institution: string): MoodleProvider | undefined {
    return Providers[institution]?.moodle
}

export function suapByName(institution: string): SuapProvider | undefined {
    return Providers[institution]?.suap
}

/* Must support SUAP and moodle */
export function supportsOne(institution: string): boolean {
    return Providers[institution]?.features.length > 1
}