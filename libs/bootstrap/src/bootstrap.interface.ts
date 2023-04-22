export type acceptFunc = () => void;
export type disposeFunc = (param: () => Promise<void>) => void;

export interface IBootstrapService {
  main(): Promise<void>;
}
