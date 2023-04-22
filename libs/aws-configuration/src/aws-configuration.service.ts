import { Inject, Injectable } from '@nestjs/common';

import type { IAwsConfigurationService } from '@app/aws-configuration';
import type { IConfigurationService } from '@app/configuration';
import type { IValidatorRegexpService } from '@app/validator-regexp';

@Injectable()
export class AwsConfigurationService implements IAwsConfigurationService {
  private _apiVersion: IAwsConfigurationService['apiVersion'];
  private _region: IAwsConfigurationService['region'];
  private _httpOptions: IAwsConfigurationService['httpOptions'];
  private _credentials: IAwsConfigurationService['credentials'];

  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IValidatorRegexpService')
    private readonly validatorRegexpService: IValidatorRegexpService,
  ) {
    this._loadCredentials();
  }

  private _loadCredentials() {
    this.credentials = {
      accessKeyId: this.configurationService.aws.accessKeyId,
      secretAccessKey: this.configurationService.aws.secretAccessKey,
    };
  }

  public set apiVersion(version: IAwsConfigurationService['apiVersion']) {
    if (version !== 'latest') {
      this.validatorRegexpService.custom(
        version,
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
        '2006-03-01',
      );
    }

    this._apiVersion = version;
  }

  public get apiVersion() {
    return this._apiVersion;
  }

  public set region(region: IAwsConfigurationService['region']) {
    this.validatorRegexpService.custom(
      region,
      /^([a-z]{2})-([a-z]{4,})-([0-9]{1})$/,
      'us-east-1',
    );

    this._region = region;
  }

  public get region() {
    return this._region;
  }

  public set httpOptions(options: IAwsConfigurationService['httpOptions']) {
    this._httpOptions = {
      ...options,
    };
  }

  public get httpOptions() {
    return this._httpOptions;
  }

  public set credentials(credentials: IAwsConfigurationService['credentials']) {
    this._credentials = credentials;
  }

  public get credentials() {
    return this._credentials;
  }

  public options() {
    return {
      apiVersion: this._apiVersion,
      region: this._region,
      httpOptions: this._httpOptions,
      credentials: this._credentials,
    };
  }
}
