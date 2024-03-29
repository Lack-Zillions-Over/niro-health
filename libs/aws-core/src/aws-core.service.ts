import { Inject, Injectable } from '@nestjs/common';
import * as https from 'https';

import type { EC2, S3 } from 'aws-sdk';
import type { HTTPOptions } from 'aws-sdk/lib/core';
import type {
  IAwsCoreService,
  IAwsCoreServiceBase,
} from '@app/aws-core/aws-core.interface';
import type { IConfigurationService } from '@app/configuration';
import type { IAwsConfigurationService } from '@app/aws-configuration';
import type { IAwsStsService, Role3rdParty } from '@app/aws-sts';

/**
 * @description The module that provides the core AWS services for the other modules.
 */
@Injectable()
export class AwsCoreService implements IAwsCoreService, IAwsCoreServiceBase {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IAwsConfigurationService')
    private readonly awsConfigurationService: IAwsConfigurationService,
    @Inject('IAwsStsService') private readonly awsStsService: IAwsStsService,
  ) {
    this.initialize();
  }

  /**
   * @description Initialize the AWS configuration.
   */
  private async initialize() {
    this._configuration.apiVersion = this._apiVersion;
    this._configuration.region = this._region;
    this._configuration.httpOptions = this._httpOptions;
  }

  /**
   * @description Get the AWS API version from the configuration.
   */
  private get _apiVersion(): string {
    return this.configurationService.getVariable('aws_api_version') ?? 'latest';
  }

  /**
   * @description Get the AWS region from the configuration.
   */
  private get _region(): string {
    return this.configurationService.getVariable('aws_region') ?? 'us-east-1';
  }

  /**
   * @description Get the AWS HTTP options.
   */
  private get _httpOptions(): HTTPOptions {
    return {
      agent: new https.Agent({
        maxSockets: 25,
        keepAlive: true,
        keepAliveMsecs: 30000,
      }),
    };
  }

  /**
   * @description Get the AWS configuration service.
   */
  private get _configuration() {
    return this.awsConfigurationService;
  }

  /**
   * @description Get the AWS STS service.
   */
  private get _sts() {
    return this.awsStsService;
  }

  /**
   * @description Get the client for the AWS services.
   */
  public client(): Promise<EC2 | S3> {
    throw new Error(
      'Method not implemented in base class. Use a subclass instead of AwsCoreService directly.',
    );
  }

  /**
   * @description Set the role for the 3rd party.
   */
  public async setRole3rdParty(role3rdParty: Role3rdParty): Promise<void> {
    await this.awsStsService.saveRole(role3rdParty);
  }

  /**
   * @description Get the AWS configuration.
   */
  public async configuration() {
    const credentials = await this._sts.assumeRole();

    if (credentials instanceof Error) {
      return this._configuration.options();
    } else {
      return {
        ...this._configuration.options(),
        credentials: {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretAccessKey,
          sessionToken: credentials.SessionToken,
          expireTime: credentials.Expiration,
        },
      };
    }
  }
}
