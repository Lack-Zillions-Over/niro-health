import { PropString as Types } from '@/core/libs/propString/types';

export class PropString implements Types.Class {
  public execute(text: string, object: Types.Value) {
    if (text === '')
      return new Error(
        `Prop "${text}" is empty. Please input a valid template, for example: prop1.prop2`,
      );

    if (typeof text !== 'string')
      return new Error(`Text prop "${text}" is invalid.`);

    let value, error;

    for (const [index, key] of text.split('.').entries()) {
      if (index === 0) {
        value = object[key];
      } else {
        if (!value[key]) {
          error = `Prop "${key}" not found in locale."`;
          break;
        }

        value = value[key];
      }
    }

    if (error) return new Error(error);

    return value as string;
  }
}
