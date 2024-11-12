import MobileApi from "@/moodle/MobileApi"
import SuapContext from "@/SUAP/SuapContext"
import { HAS_MOODLE_SUPPORT, HAS_SUAP_SUPPORT } from "./FeatureFlags"
import { MoodleBridge } from "@/bridge/MoodleBridge"

export interface MoodleProvider {
    api: MobileApi,
    useBridge: (token: string) => MoodleBridge
}

export interface SuapProvider {
    api: SuapContext
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
            useBridge: (token: string) => new MoodleBridge(token, "Presencial IF Goiano")
        },
    },

    "Cefet AVA": {
        features: [HAS_MOODLE_SUPPORT],
        moodle: {
            api: new MobileApi("https://ava.cefetmg.br"),
            useBridge: (token: string) => new MoodleBridge(token, "Cefet AVA")
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

/* Must support SUAP and Moodle */
export function supportsOne(institution: string): boolean {
    return Providers[institution]?.features.length > 1
}