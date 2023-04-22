export interface IPropStringService {
  execute<T, R>(text: string, object: T): R;
}
