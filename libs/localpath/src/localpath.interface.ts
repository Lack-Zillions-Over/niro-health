export interface ILocalPathService {
  local(p: string): string;
  localExists(p: string): boolean;
  localCreate(p: string): void;
}
