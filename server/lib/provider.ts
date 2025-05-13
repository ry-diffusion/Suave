import type { MoodleApiClient } from "@webhare/moodle-webservice";

export interface LoginDetails {
  username: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
}

export abstract class Provider {
  public abstract login(details: LoginDetails): Promise<LoginResponse>;
  public abstract getMoodleClient(token: string): MoodleApiClient;
}
