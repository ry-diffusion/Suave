import type { LoginDetails, LoginResponse } from "../provider";
import { Provider } from "../provider";
import { MoodleApi, MoodleClient } from "@webhare/moodle-webservice";

export class IFGoianoPresencialProvider extends Provider {
  private _baseUrl = "https://presencial.ifgoiano.edu.br/";

  getMoodleClient(token: string) {
    const api = MoodleApi({
      baseUrl: this._baseUrl,
      token,
    });
    return api;
  }
  async login(loginDetails: LoginDetails): Promise<LoginResponse> {
    const { token } = await MoodleClient.authenticate({
      baseUrl: this._baseUrl,
      credentials: {
        username: loginDetails.username,
        password: loginDetails.password,
      },
    });

    return {
      authToken: token,
    };
  }
}
