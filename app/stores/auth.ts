import { defineStore } from "pinia";

interface User {
	institution: string;
	fullName: string;
	avatarUrl: string;
	hasAlternativeIdentity?: boolean;
}

interface AuthContext {
	[key: string]: any;
}

interface Identity {
	name: string;
	avatarUrl: string;
	hasAlternativeIdentity?: boolean;
}

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as User | null,
		authContext: null as AuthContext | null,
		identity: null as Identity | null,
	}),
	actions: {
		setSession(user: User, authContext: AuthContext, identity: Identity) {
			this.user = user;
			this.authContext = authContext;
			this.identity = identity;
		},
		clearSession() {
			this.user = null;
			this.authContext = null;
			this.identity = null;
		},
	},
});
