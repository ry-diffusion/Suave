export interface IMoodleClient<TAuthType, TAssignmentType> {
    authenticate(username: string, password: string): Promise<TAuthType>;
    fetchAssignments(auth: TAuthType): Promise<TAssignmentType[]>;
} 