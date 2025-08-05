import { AppException } from "~~/shared/errors";
import { Err, Ok, type Result } from "./result";

async function tryFetchImpl(
  url: string,
  init?: RequestInit
): Promise<Result<Response, Error>> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      if (response.status === 401) {
        console.error(
          `[HTTP/${url}] Sessão expirada: ${
            response.statusText
          }: ${await response.text()}`
        );
        return Err(new AppException("Sessão expirada", "SESSION_EXPIRED"));
      }
      if (response.status == 404) {
        console.error(
          `[HTTP/${url}] Página não encontrada: ${
            response.statusText
          }: ${await response.text()}`
        );
        return Err(new AppException("Página não encontrada", "NOT_FOUND"));
      }

      if (response.status == 500) {
        console.error(
          `[HTTP/${url}] Erro interno do servidor: ${
            response.statusText
          }: ${await response.text()}`
        );
        return Err(
          new AppException("Erro interno do servidor", "EXTERNAL_SERVICE_ERROR")
        );
      }
      return Err(new AppException(`HTTP ${response.status}`, "HTTP_ERROR"));
    }
    return Ok(response);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error("Unknown fetch error"));
  }
}

export async function tryFetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<Result<T, Error>> {
  const responseResult = await tryFetchImpl(url, init);
  if (responseResult.error) return responseResult as Result<T, Error>;
  try {
    const data = await responseResult.data.json();
    return Ok(data as T);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error("JSON parse error"));
  }
}
