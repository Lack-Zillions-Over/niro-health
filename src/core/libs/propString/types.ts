export declare namespace PropString {
  export type Value = { [key: string]: string };

  export interface Class {
    execute(text: string, object: Value);
  }
}
