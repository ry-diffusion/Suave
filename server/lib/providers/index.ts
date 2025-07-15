import type { institutionKind } from "../institutions";
import type {
  IProvider,
} from "../provider";
import { IFGoianoPresencialProvider } from "./IFGoianoPresencial";

export function getProviderById(
  kind: keyof typeof institutionKind.Values,
): IProvider<any, any> {
  switch (kind) {
    case "ifgoiano-presencial":
      return new IFGoianoPresencialProvider();
    default:
      throw new Error(`Provider not found for institution kind: ${kind}`);
  }
}
