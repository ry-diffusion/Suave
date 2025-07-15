export type MoodleAuthSchema = {
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

export type AuthContext = {
    ead: MoodleAuthContext | null;
}; 