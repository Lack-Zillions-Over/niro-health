import { Injectable } from '@nestjs/common';
import * as https from 'https';

import type { HTTPOptions } from 'aws-sdk/lib/core';
import type { AwsCore } from '@app/aws-core/aws-core.interface';

import { ConfigurationService } from '@app/configuration';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

@Injectable()
export class AwsCoreService implements AwsCore.Class, AwsCore.Base {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly awsConfigurationService: AwsConfigurationService,
    private readonly awsStsService: AwsStsService,
  ) {
    this.initialize();
  }

  private async initialize() {
    this._configuration.apiVersion = this._apiVersion;
    this._configuration.region = this._region;
    this._configuration.httpOptions = this._httpOptions;
  }

  private get _apiVersion(): string {
    return this.configurationService.getVariable('aws_api_version') ?? 'latest';
  }

  private get _region(): string {
    return this.configurationService.getVariable('aws_region') ?? 'us-east-1';
  }

  private get _httpOptions(): HTTPOptions {
    return {
      agent: new https.Agent({
        maxSockets: 25,
        keepAlive: true,
        keepAliveMsecs: 30000,
      }),
    };
  }

  private get _configuration() {
    return this.awsConfigurationService;
  }

  private get _sts() {
    return this.awsStsService;
  }

  public async setRole3rdParty(
    role3rdParty: AwsCore.Role3rdParty,
  ): Promise<void> {
    await this.awsStsService.saveRole(role3rdParty);
  }

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
