export type Session = {
  tokenRevalidate: JWTRevalidate;
};

export type JWTRevalidate = {
  id: string;
  username: string;
  value: string;
  signature: string;
};
