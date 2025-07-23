import type { Institution } from "./institution";
import { z } from "zod";

export const institutions: Institution[] = [
	{
		name: "IF Goiano - Presencial",
		id: "ifgoiano-presencial",
		moodle: {
			moodleUrl: "https://presencial.ifgoiano.edu.br",
		},
	},
];

export const institutionKind = z.enum(["ifgoiano-presencial"]);
