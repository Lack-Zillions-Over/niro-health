import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import crypto from 'crypto';
import Redis from 'ioredis';
import { dirname, resolve } from 'path';
import { compress, decompress } from 'lzutf8';

import { i18n } from '@app/i18n/i18n.interface';
import { PropStringService } from '@app/prop-string';

@Injectable()
export class I18nService implements i18n.Class {
  private _locale: string;
  private _locales: string[];
  private _path: string;
  private _driver: i18n.Drivers;
  private _client: Redis;

  constructor(private readonly propStringService: PropStringService) {
    this._client = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT),
    });
    this._setDefaultOptions();
    this._initialize();
  }

  private _setDefaultOptions(
    options: i18n.Config = {
      locale: {
        main: 'en',
        path: 'locales',
        languages: ['en'],
        driver: 'fs',
      },
    },
  ) {
    this._locale = options.locale.main;
    this._locales = options.locale.languages;
    this._path = options.locale.path;
    this._driver = options.locale.driver;
  }

  private async _initialize() {
    this._writeRelativeLocalePath();

    for (const locale of this._locales) {
      await this._writeFileLocale(locale);
    }
  }

  private _redisPreffix() {
    return 'lzo-i18n-';
  }

  private _compress<T>(value: T): string {
    return compress(JSON.stringify(value), { outputEncoding: 'Base64' });
  }

  private _decompress<T>(value: string): T {
    return JSON.parse(
      decompress(value, { inputEncoding: 'Base64', outputEncoding: 'String' }),
    );
  }

  private _redisSerializeKey(key: string) {
    return crypto
      .createHash('md5')
      .update(`${this._redisPreffix()}${key}`)
      .digest('hex');
  }

  private async _redisSave(key: string, value: string) {
    return await this._client.set(key, value);
  }

  private async _redisGet(key: string) {
    return await this._client.get(key);
  }

  private async _redisDelete(key: string) {
    return await this._client.del(key);
  }

  private _writeRelativeLocalePath() {
    if (this._driver === 'fs') {
      const path = resolve(dirname(__dirname), `./${this._path}`);

      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    }
  }

  private _relativeLocalePath(locale?: string) {
    return resolve(
      dirname(__dirname),
      `./${this._path}`,
      `./${locale ? locale : this._locale}.txt`,
    );
  }

  private async _fileLocaleExists() {
    if (this._driver === 'redis') {
      if (await this._redisGet(this._redisSerializeKey(this._locale)))
        return true;
      return false;
    }

    return fs.existsSync(this._relativeLocalePath());
  }

  private async _writeFileLocale(locale: string) {
    const data = { hello: 'Hi $1' };
    const fileRaw = this._compress(data);

    if (this._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);

      if (!fs.existsSync(filePath))
        return fs.writeFileSync(filePath, fileRaw, { encoding: 'utf8' });
    } else if (this._driver === 'redis') {
      if (!(await this._redisGet(this._redisSerializeKey(locale))))
        return await this._redisSave(this._redisSerializeKey(locale), fileRaw);
    }
  }

  private async _readFileLocale<T>(): Promise<T> {
    if (this._driver === 'fs') {
      return this._decompress(
        fs.readFileSync(this._relativeLocalePath(), 'utf8'),
      );
    } else if (this._driver === 'redis') {
      return this._decompress(
        await this._redisGet(this._redisSerializeKey(this._locale)),
      );
    }

    return {} as T;
  }

  private async _definePropFileLocale<T>(locale: string, prop: T) {
    if (
      locale.length <= 0 ||
      typeof prop !== 'object' ||
      Object.keys(prop).length <= 0
    )
      return false;

    if (!this._locales.find((_locale) => _locale === locale))
      return Promise.reject(new Error(`Locale ${locale} not found!`));

    const generateData = async <D, P>(data: D, prop: P) => {
      for (const key of Object.keys(prop)) {
        data[key] = prop[key];
      }

      return data;
    };

    if (this._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);

      let fileData = this._decompress(
        fs.readFileSync(this._relativeLocalePath(locale), 'utf8'),
      );

      fileData = await generateData(fileData, prop);

      return fs.writeFileSync(filePath, this._compress(fileData), {
        encoding: 'utf8',
      });
    } else if (this._driver === 'redis') {
      let fileData = this._decompress(
        await this._redisGet(this._redisSerializeKey(locale)),
      );

      fileData = await generateData(fileData, prop);

      return await this._redisSave(
        this._redisSerializeKey(locale),
        this._compress(fileData),
      );
    }

    return false;
  }

  private async _removePropFileLocale(locale: string, ...keys: string[]) {
    if (locale.length <= 0 || keys.length <= 0) return false;

    const generateData = async <D>(data: D, ...keys: string[]) => {
      for (const key of keys) {
        if (data[key]) delete data[key];
      }

      return data;
    };

    if (this._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);

      let fileData = this._decompress(
        fs.readFileSync(this._relativeLocalePath(locale), 'utf8'),
      );

      fileData = await generateData(fileData, ...keys);

      return fs.writeFileSync(filePath, this._compress(fileData), {
        encoding: 'utf8',
      });
    } else if (this._driver === 'redis') {
      let fileData = this._decompress(
        await this._redisGet(this._redisSerializeKey(locale)),
      );

      fileData = await generateData(fileData, ...keys);

      return await this._redisSave(
        this._redisSerializeKey(locale),
        this._compress(fileData),
      );
    }

    return false;
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
    if (
      typeof text === 'bigint' ||
      typeof text === 'number' ||
      typeof text === 'boolean' ||
      !text
    )
      return text.toString();

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

  private async _removeLocaleStore(locale: string) {
    if (this._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);

      return fs.unlinkSync(filePath);
    } else if (this._driver === 'redis') {
      return await this._redisDelete(this._redisSerializeKey(locale));
    }
  }

  /**
   * @description Define path folder for locales files
   * @example
   * "locales"
   * "data/locales"
   */
  public setPath(path: string): void {
    this._path = path;
  }

  /**
   * @description Define driver used for store data
   * @example
   * "fs"
   * "redis"
   */
  public setDriver(driver: i18n.Drivers): void {
    this._driver = driver;
  }

  /**
   * @description Add the current locale
   */
  public async addLocale(locale: string) {
    if (!this._locales.find((_locale) => _locale === locale)) {
      await this._writeFileLocale(locale);
      this._locales.push(locale);
    }

    this._locale = locale;
  }

  /**
   * @description Returns the path folder for locales files
   */
  public getPath(): string {
    return resolve(dirname(__dirname), `./${this._path}`);
  }

  /**
   * @description Returns the driver used for store data
   */
  public getDriver(): string {
    return this._driver;
  }

  /**
   * @description Get the current locale
   */
  public getLocale(): string {
    return this._locale;
  }

  /**
   * @description Get all locales
   */
  public getLocales(): string[] {
    return this._locales;
  }

  /**
   * @description Reset all locales
   */
  public async resetLocales(): Promise<void> {
    for (const locale of this._locales) {
      await this._removeLocaleStore(locale);
      await this._writeFileLocale(locale);
    }
  }

  /**
   * @description Remove a locale
   */
  public async removeLocale(locale: string): Promise<number | void> {
    this._locales = this._locales.filter((_locale) => _locale !== locale);

    if (this._locale === locale) {
      const index = this._locales.indexOf(locale);

      if (index > 0) this._locale = this._locales[this._locales.length - 1];
      else this._locale = this._locales[0];
    }

    return await this._removeLocaleStore(locale);
  }

  /**
   * @description Define a property in a locale
   */
  public async defineProperty<T>(
    locale: string,
    prop: T,
  ): Promise<false | void | 'OK'> {
    return await this._definePropFileLocale(locale, prop);
  }

  /**
   * @description Remove a property in a locale
   */
  public async removeProperty(
    locale: string,
    ...props: string[]
  ): Promise<false | void | 'OK'> {
    return await this._removePropFileLocale(locale, ...props);
  }

  /**
   * @description Translate a phrase in the current locale
   */
  public async translate(phrase: string, ...params: string[]): Promise<string> {
    const filePath = this._relativeLocalePath();

    if (!(await this._fileLocaleExists()))
      return `Locale "${this._locale}" not found in locales folder: ${filePath}`;

    const locale = await this._readFileLocale<Record<string, string>>(),
      value = this.propStringService.execute<
        Record<string, string>,
        string | null
      >(phrase, locale);

    if (!value) return `Phrase "${phrase}" not found in locale.`;

    const parserValue = this._parserText(value, ...params);

    if (parserValue instanceof Error) return parserValue.message;

    return parserValue as string;
  }
}
