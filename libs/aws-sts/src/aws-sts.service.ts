import { Inject, Injectable } from '@nestjs/common';
import { STS } from 'aws-sdk';

import type {
  IAwsStsService,
  Role3rdParty,
  RoleRequest,
  RoleResponse,
} from '@app/aws-sts/aws-sts.interface';
import type { IAwsConfigurationService } from '@app/aws-configuration';
import type { IConfigurationService } from '@app/configuration';

/**
 * @description The module that provides the service to assume a role in AWS STS service.
 */
@Injectable()
export class AwsStsService implements IAwsStsService {
  /**
   * @description The role 3rd party.
   */
  private _role3rdParty: Role3rdParty;

  constructor(
    @Inject('IAwsConfigurationService')
    private readonly awsConfigurationService: IAwsConfigurationService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {}

  /**
   * @description Save the role 3rd party.
   */
  private set role3rdParty(role3rdParty: Role3rdParty) {
    this._role3rdParty = role3rdParty;
  }

  /**
   * @description Get the role 3rd party.
   */
  private get role3rdParty() {
    return this._role3rdParty;
  }

  /**
   * @description Normalize the variable name by role access key id.
   */
  private _normalizeVariableByAccessKeyId(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_ACCESS_KEY_ID`;
  }

  /**
   * @description Normalize the variable name by role secret access key.
   */
  private _normalizeVariableBySecretAccessKey(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SECRET_ACCESS_KEY`;
  }

  /**
   * @description Normalize the variable name by role session token.
   */
  private _normalizeVariableBySessionToken(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_SESSION_NAME`;
  }

  /**
   * @description Normalize the variable name by role expiration.
   */
  private _normalizeVariableByExpiration(
    sessionName: Role3rdParty['sessionName'],
  ) {
    return `AWS_ROLE_${sessionName}_EXPIRATION`;
  }

  /**
   * @description Save the role in environment variables.
   */
  private _saveEnvRole(
    sessionName: Role3rdParty['sessionName'],
    credentials: RoleResponse['Credentials'],
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

  /**
   * @description Get the role in environment variables.
   */
  private _getEnvRole(
    sessionName: Role3rdParty['sessionName'],
  ): RoleResponse['Credentials'] | null {
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

  /**
   * @description Save the role 3rd party.
   */
  public async saveRole(role3rdParty: Role3rdParty): Promise<void> {
    this.role3rdParty = role3rdParty;
  }

  /**
   * @description Assume the role 3rd party.
   */
  public async assumeRole(): Promise<RoleResponse['Credentials'] | Error> {
    if (!this._role3rdParty) return new Error('Role3rdParty not defined');

    const credentials = this._getEnvRole(this.role3rdParty.sessionName);

    if (credentials) return credentials;

    const params: RoleRequest = {
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
