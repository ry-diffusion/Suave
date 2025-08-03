import "#auth-utils";

interface MoodleSecureData {
	apiKey: string;
}

interface SuapSecureData {
	apiKey: string;
}

declare module "#auth-utils" {
	export interface User {
		institution: string;
		// cached full name
		fullName: string;
		// cached avatar URL
		avatarUrl: string;
	}

	// interface UserSession {}

	interface SecureSessionData {
		moodle?: MoodleSecureData;
		suap?: SuapSecureData;
		// biome-ignore lint/suspicious/noExplicitAny: todo
		authContext?: any; // Added to match usage in session
	}
}
