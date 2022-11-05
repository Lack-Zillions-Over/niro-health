import { GeoIP } from '@/core/types/geo-ip.type';

declare type AccessToken = {
  value: string;
  signature: string;
  ipAddress: string;
  expireIn: string;
  createdAt: string;
};

declare type Device = {
  name: string;
  accessTokenValue: string;
  ipAddress: string;
};

declare type History = {
  devices: Device[];
  accessTokensCanceled: AccessToken[];
  loginInNewIpAddressAlerts: string[];
};

declare type LoginFailure = {
  attemptsCount: number;
  attemptsLimit: number;
  attemptsTimeout?: string;
};

export type Session = {
  activeClients: number;
  limitClients: number;
  accessTokens: AccessToken[];
  accessTokenRevalidate: AccessToken;
  history: History;
  allowedDevices: string[];
  loginFailure: LoginFailure;
  geoip: GeoIP[];
  banned: boolean;
  ipAddressWhitelist: string[];
  ipAddressBlacklist: string[];
};
