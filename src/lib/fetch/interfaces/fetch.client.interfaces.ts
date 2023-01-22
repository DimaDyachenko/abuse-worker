export interface FetchOptionsInterface {
  method: string;
  requestDuration?: boolean | null;
  body?: object | null;
}

export interface SendRequestDurationInterface {
  duration: number;
  url: string;
}
