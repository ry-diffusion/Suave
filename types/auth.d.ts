interface MoodleSecureData {
  apiKey: string;
}

interface SuapSecureData {
  apiKey: string;
}

declare module "#auth-utils" {
  interface User {
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
  }
}

export {};
