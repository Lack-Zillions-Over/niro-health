import { Injectable } from '@nestjs/common';

import { STS } from 'aws-sdk';

import { AwsSTS } from '@app/aws-sts/aws-sts.interface';
import { AwsConfigurationService } from '@app/aws-configuration';
import { ConfigurationService } from '@app/configuration';

@Injectable()
export class AwsStsService implements AwsSTS.Class {
  private _role3rdParty: AwsSTS.Role3rdParty;

  constructor(
    private readonly awsConfigurationService: AwsConfigurationService,
    private readonly configurationService: ConfigurationService,
  ) {}

  private set role3rdParty(role3rdParty: AwsSTS.Role3rdParty) {
    this._role3rdParty = role3rdParty;
  }

  private get role3rdParty() {
    return this._role3rdParty;
  }

  private _normalizeVariableByAccessKeyId(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_ACCESS_KEY_ID`;
  }

  private _normalizeVariableBySecretAccessKey(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SECRET_ACCESS_KEY`;
  }

  private _normalizeVariableBySessionToken(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SESSION_NAME`;
  }

  private _normalizeVariableByExpiration(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_EXPIRATION`;
  }

  private _saveEnvRole(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
    credentials: AwsSTS.RoleResponse['Credentials'],
  ) {
    this.configurationService.register(
      this._normalizeVariableByAccessKeyId(sessionName),
      credentials.AccessKeyId,
    );
    this.configurationService.register(
      this._normalizeVariableBySecretAccessKey(sessionName),
      credentials.SecretAccessKey,
    );
    this.configurationService.register(
      this._normalizeVariableBySessionToken(sessionName),
      credentials.SessionToken,
    );
    this.configurationService.register(
      this._normalizeVariableByExpiration(sessionName),
      credentials.Expiration.toISOString(),
    );
  }

  private _getEnvRole(
    sessionName: AwsSTS.Role3rdParty['sessionName'],
  ): AwsSTS.RoleResponse['Credentials'] | null {
    if (
      !this.configurationService.get(
        this._normalizeVariableByExpiration(sessionName),
      )
    )
      return null;

    const expiration = new Date(
      this.configurationService.get(
        this._normalizeVariableByExpiration(sessionName),
      ),
    );

    if (expiration > new Date()) {
      return {
        AccessKeyId: this.configurationService.get(
          this._normalizeVariableByAccessKeyId(sessionName),
        ),
        SecretAccessKey: this.configurationService.get(
          this._normalizeVariableBySecretAccessKey(sessionName),
        ),
        SessionToken: this.configurationService.get(
          this._normalizeVariableBySessionToken(sessionName),
        ),
        Expiration: expiration,
      };
    } else {
      return null;
    }
  }

  public async saveRole(role3rdParty: AwsSTS.Role3rdParty): Promise<void> {
    this.role3rdParty = role3rdParty;
  }

  public async assumeRole(): Promise<
    AwsSTS.RoleResponse['Credentials'] | Error
  > {
    if (!this._role3rdParty) return new Error('Role3rdParty not defined');

    const credentials = this._getEnvRole(this.role3rdParty.sessionName);

    if (credentials) return credentials;

    const params: AwsSTS.RoleRequest = {
      RoleArn: this.role3rdParty.roleArn,
      RoleSessionName: this.role3rdParty.sessionName,
      ExternalId: this.role3rdParty.externalId,
    };

    const client = new STS({
      ...this.awsConfigurationService.options,
    });

    const { $response, Credentials } = await client
      .assumeRole(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    this._saveEnvRole(this.role3rdParty.sessionName, Credentials);

    return Credentials;
  }
}
