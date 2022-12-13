export type WebSocketsResponse<T> = {
  error: boolean;
  message: string;
  data: T;
};
