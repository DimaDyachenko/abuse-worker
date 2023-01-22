import {
  FetchOptionsInterface,
  SendRequestDurationInterface,
} from "./interfaces/fetch.client.interfaces";

export async function send<T>(
  url: string,
  options: FetchOptionsInterface
): Promise<T | Promise<SendRequestDurationInterface>> {
  try {
    const TIMEOUT: number = 12000;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT);

    const sendTime = new Date().getTime();

    const response: Response = await fetch(url, {
      method: options.method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(options.body),
      signal: abortController.signal,
    });

    const responseTime = new Date().getTime();

    clearTimeout(timeoutId);

    if (options.requestDuration) {
      return { duration: responseTime - sendTime, url: url };
    }

    return await response.json();
  } catch (error) {
    throw (error as Error).message;
  }
}
