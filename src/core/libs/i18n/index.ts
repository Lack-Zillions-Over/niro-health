import { writeFileSync, existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { i18n as Types } from '@/core/libs/i18n/types';
import { PropString } from '@/core/libs/propString';
import { ProjectOptions } from '@/constants';
import { ProjectConfig } from '@/core/types/project-config.type';

export class Locale implements Types.Class {
  private readonly _propString: PropString;
  private _locale: string;
  private _locales: string[];
  private _path: string;

  constructor(private options?: ProjectConfig) {
    if (!this.options) this.options = { locale: {} } as ProjectConfig;

    if (!this.options.locale.main) this._locale = ProjectOptions.locale.main;
    else this._locale = this.options.locale.main;

    if (!this.options.locale.path)
      this._locales = ProjectOptions.locale.languages;
    else this._locales = this.options.locale.languages;

    if (!this.options.locale.path) this._path = ProjectOptions.locale.path;
    else this._path = this.options.locale.path;

    this._propString = new PropString();
    this._initialize();
  }

  private _initialize() {
    for (const locale of this._locales) {
      this._writeFileLocale(locale);
    }
  }

  private _relativeLocalePath(locale?: string) {
    return resolve(
      dirname(__dirname),
      `./${this._path}`,
      `./${locale ? locale : this._locale}.json`,
    );
  }

  private _fileLocaleExists() {
    return existsSync(this._relativeLocalePath());
  }

  private _writeFileLocale(locale: string) {
    const filePath = this._relativeLocalePath(locale),
      fileRaw = JSON.stringify({ hello: 'Hi $1' }, null, 2);

    if (!existsSync(filePath))
      writeFileSync(filePath, fileRaw, { encoding: 'utf8' });
  }

  private _readFileLocale() {
    return JSON.parse(
      readFileSync(this._relativeLocalePath(), 'utf8'),
    ) as Record<string, string>;
  }

  private _extractParserKeys(text: string) {
    const match = text.match(/\$([\d])/g);

    let same_key = '';

    return !match
      ? []
      : match.filter((key) => {
          if (key === same_key) return false;

          same_key = key;

          return true;
        });
  }

  private _removeParserOptions(value: string) {
    const match: string[] = [];

    if (this._isNoCascade(value)) {
      match.push(this._isNoCascade(value)[0]);
      match.push(this._getCascadeMatchValue(value));
    }
    if (this._isTrim(value)) match.push(this._isTrim(value)[0]);
    if (this._isUppercase(value)) match.push(this._isUppercase(value)[0]);
    if (this._isLowercase(value)) match.push(this._isLowercase(value)[0]);
    if (this._isSpace(value)) match.push(this._isSpace(value)[0]);
    if (this._isRepeat(value)) match.push(this._isRepeat(value)[0]);

    for (const option of match) {
      value = value.replace(option, '');
    }

    return value;
  }

  private _isNoCascade(value: string) {
    return value.match(/\.nocascade/);
  }

  private _getCascadeMatchValue(value: string) {
    return value.match(/\[(.*?)\]/)[0];
  }

  private _getCascadeValue(value: string) {
    const values = Array.from(eval(this._getCascadeMatchValue(value)));

    return values.map((value) =>
      typeof value !== 'string' ? JSON.stringify(value) : value,
    );
  }

  private _isTrim(value: string) {
    return value.match(/\.yestrim/);
  }

  private _isUppercase(value: string) {
    return value.match(/\.yesuppercase/);
  }

  private _isLowercase(value: string) {
    return value.match(/\.yeslowercase/);
  }

  private _isSpace(value: string) {
    return value.match(/\.space\[([\d])\]/);
  }

  private _getSpaceValue(value: string) {
    return parseInt(this._isSpace(value)[1]);
  }

  private _isRepeat(value: string) {
    return value.match(/\.repeat\[([\d])\]/);
  }

  private _getRepeatValue(value: string) {
    return parseInt(this._isRepeat(value)[1]);
  }

  private _parserText(text: string, ...values: string[]) {
    if (typeof text !== 'string') {
      const otherValue = text[Object.keys(text).find((key) => !parseInt(key))];

      let parserValue, newText;

      for (const value of values) {
        parserValue = Object.keys(text).find(
          (key) => parseInt(key) >= parseInt(value),
        );

        if (parserValue) {
          parserValue = text[parserValue];
          break;
        }
      }

      if (parserValue) {
        newText = this._parserText(parserValue, ...values.slice(1));
      } else {
        newText = this._parserText(otherValue, ...values.slice(1));
      }

      if (!(newText instanceof Error)) return newText;
    }

    const keys = this._extractParserKeys(text).reverse();

    if (keys.length <= 0 && values.length > 0)
      return new Error(
        `Parser keys for text "${text}" not found. Please input key with \${1..2..3...}.`,
      );

    for (const [index, value] of values.entries()) {
      const key = keys[keys.length - 1];

      if (!value) continue;

      if (value[0] === '.') {
        let valueDeep;

        const clearValue = this._removeParserOptions(value);

        if (!this._isNoCascade(value)) {
          valueDeep = this.translate(
            clearValue.slice(1),
            ...values.slice(index + 1),
          );
        } else {
          valueDeep = this.translate(
            clearValue.slice(1),
            ...(this._getCascadeValue(value) as string[]),
          );
        }

        if (this._isTrim(value)) valueDeep = valueDeep.trim();
        if (this._isUppercase(value)) valueDeep = valueDeep.toUpperCase();
        if (this._isLowercase(value)) valueDeep = valueDeep.toLowerCase();
        if (this._isSpace(value))
          valueDeep = valueDeep + ' '.repeat(this._getSpaceValue(value));
        if (this._isRepeat(value))
          valueDeep = valueDeep.repeat(this._getRepeatValue(value));

        text = String(text).replace(
          new RegExp(`\\${key}`, 'g'),
          valueDeep instanceof Error ? '???' : valueDeep,
        );
      } else {
        let parserValue = value;

        if (this._isTrim(value))
          parserValue = this._removeParserOptions(value).trim();
        if (this._isUppercase(value))
          parserValue = this._removeParserOptions(value).toUpperCase();
        if (this._isLowercase(value))
          parserValue = this._removeParserOptions(value).toLowerCase();
        if (this._isSpace(value))
          parserValue =
            this._removeParserOptions(value) +
            ' '.repeat(this._getSpaceValue(value));
        if (this._isRepeat(value))
          parserValue = this._removeParserOptions(value).repeat(
            this._getRepeatValue(value),
          );

        text = String(text).replace(new RegExp(`\\${key}`, 'g'), parserValue);
      }

      keys.pop();
    }

    return text;
  }

  public getLocale(): string {
    return this._locale;
  }

  public getLocales(): string[] {
    return this._locales;
  }

  public getPath(): string {
    return this._path;
  }

  public setLocale(locale: string) {
    if (!this._locales.find((_locale) => _locale === locale)) {
      this._writeFileLocale(locale);

      this._locales.push(locale);
    }

    this._locale = locale;
  }

  public removeLocale(locale: string) {
    this._locales = this._locales.filter((_locale) => _locale !== locale);

    if (this._locale === locale)
      this._locale = this._locales[this._locales.length - 1];
  }

  public setPath(path: string) {
    this._path = path;
  }

  public translate(phrase: string, ...params: string[]) {
    const filePath = this._relativeLocalePath();

    if (!this._fileLocaleExists())
      return new Error(
        `Locale "${this._locale}" not found in locales folder: ${filePath}`,
      );

    const locale = this._readFileLocale(),
      value = this._propString.execute(phrase, locale);

    if (value instanceof Error) return value.message;

    const parserValue = this._parserText(value, ...params);

    if (parserValue instanceof Error) return parserValue.message;

    return parserValue as string;
  }
}
