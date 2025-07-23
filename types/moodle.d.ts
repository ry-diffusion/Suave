export type ClassicAuthSchema = {
	username: string;
	password: string;
};

export type MoodleAuthContext = {
	token: string;
	userId: number;
	username: string;
};

export type MoodleAssignment = {
	id: number;
	name: string;
	dueDate: Date;
	courseId: number;
};

export type IFGoianoPresencialCredentials = {
	username: string;
	password: string;
};

export type SuapAuthContext = {
	access: string;
	refresh: string;
};

export type AuthContext = {
	creds: ClassicAuthSchema | null;
	ead: MoodleAuthContext | null;
	api: SuapAuthContext | null;
};
