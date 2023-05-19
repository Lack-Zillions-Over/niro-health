import { Inject, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as crypto from 'crypto';

import { dirname, resolve } from 'path';
import { compress, decompress } from 'lzutf8';

import type { Ii18nService, Drivers, Config } from '@app/i18n';
import type { IPropStringService } from '@app/prop-string';
import type { IRedisService } from '@app/core/redis/redis.interface';

/**
 * @description The module provides a simple way to management different languages.
 */
@Injectable()
export class i18nService implements Ii18nService {
  /**
   * @description The current locale.
   */
  private static _locale: string;

  /**
   * @description All locales.
   */
  private static _locales: string[];

  /**
   * @description The path folder for locales files.
   */
  private static _path: string;

  /**
   * @description The driver used for store data (fs or redis).
   */
  private static _driver: Drivers;

  constructor(
    @Inject('IRedisService') private readonly redisService: IRedisService,
    @Inject('IPropStringService')
    private readonly propStringService: IPropStringService,
  ) {
    this._setDefaultOptions();
    this._initialize();
  }

  /**
   * @description Set default options.
   */
  private _setDefaultOptions(
    options: Config = {
      locale: {
        main: 'en',
        path: 'locales',
        languages: ['en'],
        driver: 'fs',
      },
    },
  ) {
    if (!i18nService._locale) {
      i18nService._locale = options.locale.main;
    }

    if (!i18nService._locales || !i18nService._locales.length) {
      i18nService._locales = options.locale.languages;
    }

    if (!i18nService._path) {
      i18nService._path = options.locale.path;
    }

    if (!i18nService._driver) {
      i18nService._driver = options.locale.driver;
    }
  }

  /**
   * @description Initialize the module and create the locales files.
   */
  private async _initialize() {
    this._writeRelativeLocalePath();

    for (const locale of i18nService._locales) {
      await this._writeFileLocale(locale);
    }
  }

  /**
   * @description Get the prefix for redis.
   */
  private _redisPrefix() {
    return 'lzo-i18n-';
  }

  /**
   * @description Compress and decompress data.
   * @param value The value to compress or decompress
   */
  private _compress<T>(value: T): string {
    return compress(JSON.stringify(value), { outputEncoding: 'Base64' });
  }

  /**
   * @description Decompress data from string to object.
   * @param value The value to decompress
   */
  private _decompress<T>(value: string): T {
    return JSON.parse(
      decompress(value, { inputEncoding: 'Base64', outputEncoding: 'String' }),
    );
  }

  /**
   * @description Serialize key for redis.
   * @param key The key to serialize
   */
  private _redisSerializeKey(key: string) {
    return crypto
      .createHash('md5')
      .update(`${this._redisPrefix()}${key}`)
      .digest('hex');
  }

  /**
   * @description Save data in redis.
   * @param key The key to save
   * @param value The value to save
   */
  private async _redisSave(key: string, value: string) {
    return await this.redisService.save(key, value);
  }

  /**
   * @description Get data from redis.
   * @param key The key to get
   */
  private async _redisGet(key: string) {
    return await this.redisService.findOne(key);
  }

  /**
   * @description Delete data from redis.
   * @param key The key to delete
   */
  private async _redisDelete(key: string) {
    return await this.redisService.delete(key);
  }

  /**
   * @description Write the path folder for locales files.
   */
  private _writeRelativeLocalePath() {
    if (i18nService._driver === 'fs') {
      const path = resolve(dirname(__dirname), `./${i18nService._path}`);

      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    }
  }

  /**
   * @description Get the path folder for locales files.
   * @param locale The locale to get
   */
  private _relativeLocalePath(locale?: string) {
    return resolve(
      dirname(__dirname),
      `./${i18nService._path}`,
      `./${locale ? locale : i18nService._locale}.txt`,
    );
  }

  /**
   * @description Check if the file locale exists.
   */
  private async _fileLocaleExists() {
    if (i18nService._driver === 'redis') {
      if (await this._redisGet(this._redisSerializeKey(i18nService._locale)))
        return true;
      return false;
    }

    return fs.existsSync(this._relativeLocalePath());
  }

  /**
   * @description Write the file locale.
   * @param locale The locale to write
   */
  private async _writeFileLocale(locale: string) {
    const data = { hello: 'Hi $1' };
    const fileRaw = this._compress(data);

    if (i18nService._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);
      if (!fs.existsSync(filePath))
        return fs.writeFileSync(filePath, fileRaw, { encoding: 'utf8' });
    } else if (i18nService._driver === 'redis') {
      if (!(await this._redisGet(this._redisSerializeKey(locale))))
        return await this._redisSave(this._redisSerializeKey(locale), fileRaw);
    }
  }

  /**
   * @description Read the file locale.
   */
  private async _readFileLocale<T>(): Promise<T> {
    if (i18nService._driver === 'fs') {
      return this._decompress(
        fs.readFileSync(this._relativeLocalePath(), 'utf8'),
      );
    } else if (i18nService._driver === 'redis') {
      return this._decompress(
        (await this._redisGet(
          this._redisSerializeKey(i18nService._locale),
        )) as string,
      );
    }

    return {} as T;
  }

  /**
   * @description Define a property in a locale.
   * @param locale The locale to define property
   * @param prop The property to define
   */
  private async _definePropFileLocale<T>(locale: string, prop: T) {
    if (
      locale.length <= 0 ||
      typeof prop !== 'object' ||
      Object.keys(prop).length <= 0
    )
      return false;

    if (!i18nService._locales.find((_locale) => _locale === locale))
      return Promise.reject(new Error(`Locale ${locale} not found!`));

    const generateData = async <D, P>(data: D, prop: P) => {
      for (const key of Object.keys(prop)) {
        data[key] = prop[key];
      }

      return data;
    };

    if (i18nService._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);
      let fileData = this._decompress(
        fs.readFileSync(this._relativeLocalePath(locale), 'utf8'),
      );

      fileData = await generateData(fileData, prop);

      return fs.writeFileSync(filePath, this._compress(fileData), {
        encoding: 'utf8',
      });
    } else if (i18nService._driver === 'redis') {
      let fileData = this._decompress(
        (await this._redisGet(this._redisSerializeKey(locale))) as string,
      );

      fileData = await generateData(fileData, prop);

      return await this._redisSave(
        this._redisSerializeKey(locale),
        this._compress(fileData),
      );
    }

    return false;
  }

  /**
   * @description Remove a property in a locale.
   * @param locale The locale to remove property
   * @param keys The keys to remove
   */
  private async _removePropFileLocale(locale: string, ...keys: string[]) {
    if (locale.length <= 0 || keys.length <= 0) return false;

    const generateData = async <D>(data: D, ...keys: string[]) => {
      for (const key of keys) {
        if (data[key]) delete data[key];
      }

      return data;
    };

    if (i18nService._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);
      let fileData = this._decompress(
        fs.readFileSync(this._relativeLocalePath(locale), 'utf8'),
      );

      fileData = await generateData(fileData, ...keys);

      return fs.writeFileSync(filePath, this._compress(fileData), {
        encoding: 'utf8',
      });
    } else if (i18nService._driver === 'redis') {
      let fileData = this._decompress(
        (await this._redisGet(this._redisSerializeKey(locale))) as string,
      );

      fileData = await generateData(fileData, ...keys);

      return await this._redisSave(
        this._redisSerializeKey(locale),
        this._compress(fileData),
      );
    }

    return false;
  }

  /**
   * @description Extract parser keys from text.
   * @param text The text to extract
   */
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

  /**
   * @description Remove parser options from text.
   * @param value The value to remove options
   */
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

  /**
   * @description Check if the value is no cascade.
   * @param value The value to check
   */
  private _isNoCascade(value: string) {
    return value.match(/\.nocascade/);
  }

  /**
   * @description Get the cascade match value.
   * @param value The value to get
   */
  private _getCascadeMatchValue(value: string) {
    return value.match(/\[(.*?)\]/)[0];
  }

  /**
   * @description Get the cascade value.
   * @param value The value to get
   */
  private _getCascadeValue(value: string) {
    const values = Array.from(eval(this._getCascadeMatchValue(value)));

    return values.map((value) =>
      typeof value !== 'string' ? JSON.stringify(value) : value,
    );
  }

  /**
   * @description Check if the value is trim.
   * @param value The value to check
   */
  private _isTrim(value: string) {
    return value.match(/\.yestrim/);
  }

  /**
   * @description Check if the value is uppercase.
   * @param value The value to check
   */
  private _isUppercase(value: string) {
    return value.match(/\.yesuppercase/);
  }

  /**
   * @description Check if the value is lowercase.
   * @param value The value to check
   */
  private _isLowercase(value: string) {
    return value.match(/\.yeslowercase/);
  }

  /**
   * @description Check if the value is space.
   * @param value The value to check
   */
  private _isSpace(value: string) {
    return value.match(/\.space\[([\d])\]/);
  }

  /**
   * @description Get the space value.
   * @param value The value to get
   */
  private _getSpaceValue(value: string) {
    return parseInt(this._isSpace(value)[1]);
  }

  /**
   * @description Check if the value is repeat.
   * @param value The value to check
   */
  private _isRepeat(value: string) {
    return value.match(/\.repeat\[([\d])\]/);
  }

  /**
   * @description Get the repeat value.
   * @param value The value to get
   */
  private _getRepeatValue(value: string) {
    return parseInt(this._isRepeat(value)[1]);
  }

  /**
   * @description Parser text with params.
   * @param text The text to parser
   * @param values The values to parser
   */
  private async _parserText(text: string, ...values: string[]) {
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
        newText = await this._parserText(parserValue, ...values.slice(1));
      } else {
        newText = await this._parserText(otherValue, ...values.slice(1));
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
          valueDeep = await this.translate(
            clearValue.slice(1),
            ...values.slice(index + 1),
          );
        } else {
          valueDeep = await this.translate(
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

  /**
   * @description Remove a locale from store.
   * @param locale The locale to remove
   */
  private async _removeLocaleStore(locale: string) {
    if (i18nService._driver === 'fs') {
      const filePath = this._relativeLocalePath(locale);
      return fs.unlinkSync(filePath);
    } else if (i18nService._driver === 'redis') {
      return await this._redisDelete(this._redisSerializeKey(locale));
    }
  }

  /**
   * @description Define path folder for locales files.
   * @param path The path to define
   * @example
   * "locales"
   * "data/locales"
   */
  public setPath(path: string): void {
    i18nService._path = path;
  }

  /**
   * @description Define driver used for store data.
   * @param driver The driver to define (fs or redis)
   * @example
   * "fs"
   * "redis"
   */
  public setDriver(driver: Drivers): void {
    i18nService._driver = driver;
  }

  /**
   * @description Add the current locale.
   * @param locale The locale to add
   */
  public async addLocale(locale: string) {
    if (!i18nService._locales.find((_locale) => _locale === locale)) {
      await this._writeFileLocale(locale);
      i18nService._locales.push(locale);
    }

    i18nService._locale = locale;
  }

  /**
   * @description Returns the path folder for locales files.
   */
  public getPath(): string {
    return resolve(dirname(__dirname), `./${i18nService._path}`);
  }

  /**
   * @description Returns the driver used for store data.
   */
  public getDriver(): string {
    return i18nService._driver;
  }

  /**
   * @description Get the current locale.
   */
  public getLocale(): string {
    return i18nService._locale;
  }

  /**
   * @description Get all locales.
   */
  public getLocales(): string[] {
    return i18nService._locales;
  }

  /**
   * @description Reset all locales.
   */
  public async resetLocales(): Promise<void> {
    for (const locale of i18nService._locales) {
      await this._removeLocaleStore(locale);
      await this._writeFileLocale(locale);
    }
  }

  /**
   * @description Remove a locale.
   * @param locale The locale to remove
   */
  public async removeLocale(locale: string): Promise<number | void> {
    i18nService._locales = i18nService._locales.filter(
      (_locale) => _locale !== locale,
    );

    if (i18nService._locale === locale) {
      const index = i18nService._locales.indexOf(locale);

      if (index > 0)
        i18nService._locale =
          i18nService._locales[i18nService._locales.length - 1];
      else i18nService._locale = i18nService._locales[0];
    }

    return (await this._removeLocaleStore(locale)) ? 1 : 0;
  }

  /**
   * @description Set the current locale.
   * @param locale The locale to set
   */
  public async defineLocale(locale: string) {
    return await this.addLocale(locale);
  }

  /**
   * @description Define a property in a locale.
   * @param locale The locale to define property
   * @param prop The property to define
   */
  public async defineProperty<T>(
    locale: string,
    prop: T,
  ): Promise<false | void | 'OK'> {
    return (await this._definePropFileLocale(locale, prop)) ? 'OK' : false;
  }

  /**
   * @description Remove a property in a locale.
   * @param locale The locale to remove property
   * @param props The properties to remove
   */
  public async removeProperty(
    locale: string,
    ...props: string[]
  ): Promise<false | void | 'OK'> {
    return (await this._removePropFileLocale(locale, ...props)) ? 'OK' : false;
  }

  /**
   * @description Translate a phrase in the current locale.
   * @param phrase The phrase to translate
   * @param params The params to replace
   */
  public async translate(phrase: string, ...params: string[]): Promise<string> {
    const filePath = this._relativeLocalePath();

    if (!(await this._fileLocaleExists()))
      return `Locale "${i18nService._locale}" not found in locales folder: ${filePath}`;

    const locale = await this._readFileLocale<Record<string, string>>(),
      value = this.propStringService.execute<
        Record<string, string>,
        string | null
      >(phrase, locale);

    if (!value) return `Phrase "${phrase}" not found in locale.`;

    const parserValue = await this._parserText(value, ...params);

    if (parserValue instanceof Error) return parserValue.message;

    return parserValue as string;
  }
}
