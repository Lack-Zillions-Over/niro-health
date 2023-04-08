import { Injectable } from '@nestjs/common';

import { AwsConfiguration } from '@app/aws-configuration/aws-configuration.interface';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';

@Injectable()
export class AwsConfigurationService implements AwsConfiguration.Class {
  private _apiVersion: AwsConfiguration.Class['apiVersion'];
  private _region: AwsConfiguration.Class['region'];
  private _httpOptions: AwsConfiguration.Class['httpOptions'];
  private _credentials: AwsConfiguration.Class['credentials'];

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly validatorRegexpService: ValidatorRegexpService,
  ) {
    this._loadCredentials();
  }

  private _loadCredentials() {
    this.credentials = {
      accessKeyId: this.configurationService.aws.accessKeyId,
      secretAccessKey: this.configurationService.aws.secretAccessKey,
    };
  }

  public set apiVersion(version: AwsConfiguration.Class['apiVersion']) {
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

  public set region(region: AwsConfiguration.Class['region']) {
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

  public set httpOptions(options: AwsConfiguration.Class['httpOptions']) {
    this._httpOptions = {
      ...options,
    };
  }

  public get httpOptions() {
    return this._httpOptions;
  }

  public set credentials(credentials: AwsConfiguration.Class['credentials']) {
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
