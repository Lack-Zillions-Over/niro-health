export declare function Occurrence(...args: number[]): string;

export type Digest = 'base64' | 'base64url' | 'hex';

export type Characters = Partial<{
  abc: string[];
  int: number[];
  specials: string[];
}>;

export interface IRandomService {
  int(max: number): number;
  hash(length: number, digest: Digest): string;
  uuid(): string;
  password(length?: number): string;
  string(length: number, characters?: Characters): string;
}
