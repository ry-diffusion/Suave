import { Institution } from "@/Support/Institutions";

export type KnownInfo = {
  revision: number;
  firstName: string;
  fullName: string;
  pictureUrl: string | null;
};

export type Passport = {
  username: string;
  password: string;
  moodleToken: string;
  suapToken: string | null;
  knownInfo: KnownInfo | null;
  institution: Institution;
};

export type SessionData = {
  isLoggedIn: boolean;
  loggedInAt?: Date;
  passport?: Passport;
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};
