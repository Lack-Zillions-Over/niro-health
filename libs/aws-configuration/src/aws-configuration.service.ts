import { Inject, Injectable } from '@nestjs/common';

import type { IAwsConfigurationService } from '@app/aws-configuration';
import type { IConfigurationService } from '@app/configuration';
import type { IValidatorRegexpService } from '@app/validator-regexp';

/**
 * @description The module provides a service for configuring the AWS SDK.
 */
@Injectable()
export class AwsConfigurationService implements IAwsConfigurationService {
  /**
   * @description The AWS API version to use.
   */
  private _apiVersion: IAwsConfigurationService['apiVersion'];

  /**
   * @description The AWS region to use.
   */
  private _region: IAwsConfigurationService['region'];

  /**
   * @description The AWS HTTP options to use.
   */
  private _httpOptions: IAwsConfigurationService['httpOptions'];

  /**
   * @description The AWS credentials to use.
   */
  private _credentials: IAwsConfigurationService['credentials'];

  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IValidatorRegexpService')
    private readonly validatorRegexpService: IValidatorRegexpService,
  ) {
    this._loadCredentials();
  }

  /**
   * @description Load the AWS credentials from the configuration service.
   */
  private _loadCredentials() {
    this.credentials = {
      accessKeyId: this.configurationService.aws.accessKeyId,
      secretAccessKey: this.configurationService.aws.secretAccessKey,
    };
  }

  /**
   * @description Set the AWS API version.
   * @param version The AWS API version to use.
   */
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

  /**
   * @description Get the AWS API version.
   */
  public get apiVersion() {
    return this._apiVersion;
  }

  /**
   * @description Set the AWS region.
   * @param region The AWS region to use.
   */
  public set region(region: IAwsConfigurationService['region']) {
    this.validatorRegexpService.custom(
      region,
      /^([a-z]{2})-([a-z]{4,})-([0-9]{1})$/,
      'us-east-1',
    );

    this._region = region;
  }

  /**
   * @description Get the AWS region.
   */
  public get region() {
    return this._region;
  }

  /**
   * @description Set the AWS HTTP options.
   * @param options The AWS HTTP options to use.
   */
  public set httpOptions(options: IAwsConfigurationService['httpOptions']) {
    this._httpOptions = {
      ...options,
    };
  }

  /**
   * @description Get the AWS HTTP options.
   */
  public get httpOptions() {
    return this._httpOptions;
  }

  /**
   * @description Set the AWS credentials.
   * @param credentials The AWS credentials to use.
   */
  public set credentials(credentials: IAwsConfigurationService['credentials']) {
    this._credentials = credentials;
  }

  /**
   * @description Get the AWS credentials.
   */
  public get credentials() {
    return this._credentials;
  }

  /**
   * @description Get the AWS configuration options.
   */
  public options() {
    return {
      apiVersion: this._apiVersion,
      region: this._region,
      httpOptions: this._httpOptions,
      credentials: this._credentials,
    };
  }
}
