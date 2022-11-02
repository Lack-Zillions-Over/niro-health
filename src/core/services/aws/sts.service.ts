import { Injectable } from '@nestjs/common';
import { awsConfiguration } from '@/core/constants';

import * as STS from 'aws-sdk/clients/sts';

export interface Role3rdParty {
  roleArn: STS.AssumeRoleRequest['RoleArn'];
  sessionName: STS.AssumeRoleRequest['RoleSessionName'];
  externalId: STS.AssumeRoleRequest['ExternalId'];
}

@Injectable()
export class STSAWService {
  private _normalizeVariableByAccessKeyId(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_ACCESS_KEY_ID`;
  }

  private _normalizeVariableBySecretAccessKey(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SECRET_ACCESS_KEY`;
  }

  private _normalizeVariableBySessionToken(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SESSION_NAME`;
  }

  private _normalizeVariableByExpiration(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_EXPIRATION`;
  }

  private _saveEnvRole(
    sessionName: Role3rdParty['sessionName'],
    credentials: STS.AssumeRoleResponse['Credentials'],
  ) {
    process.env[this._normalizeVariableByAccessKeyId(sessionName)] =
      credentials.AccessKeyId;
    process.env[this._normalizeVariableBySecretAccessKey(sessionName)] =
      credentials.SecretAccessKey;
    process.env[this._normalizeVariableBySessionToken(sessionName)] =
      credentials.SessionToken;
    process.env[this._normalizeVariableByExpiration(sessionName)] =
      credentials.Expiration.toISOString();
  }

  private _getEnvRole(
    sessionName: Role3rdParty['sessionName'],
  ): STS.AssumeRoleResponse['Credentials'] | null {
    if (!process.env[this._normalizeVariableByExpiration(sessionName)])
      return null;

    const expiration = new Date(
      process.env[this._normalizeVariableByExpiration(sessionName)],
    );

    if (expiration > new Date()) {
      return {
        AccessKeyId:
          process.env[this._normalizeVariableByAccessKeyId(sessionName)],
        SecretAccessKey:
          process.env[this._normalizeVariableBySecretAccessKey(sessionName)],
        SessionToken:
          process.env[this._normalizeVariableBySessionToken(sessionName)],
        Expiration: expiration,
      };
    } else {
      return null;
    }
  }

  protected async assumeRole(
    role3rdParty: Role3rdParty,
  ): Promise<STS.AssumeRoleResponse['Credentials'] | Error> {
    const credentials = this._getEnvRole(role3rdParty.sessionName);

    if (credentials) return credentials;

    const params: STS.AssumeRoleRequest = {
      RoleArn: role3rdParty.roleArn,
      RoleSessionName: role3rdParty.sessionName,
      ExternalId: role3rdParty.externalId,
    };

    const client = new STS(awsConfiguration);

    const { $response, Credentials } = await client
      .assumeRole(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    this._saveEnvRole(role3rdParty.sessionName, Credentials);

    return Credentials;
  }
}
