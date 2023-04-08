import type {
  AssumeRoleRequest,
  AssumeRoleResponse,
} from 'aws-sdk/clients/sts';

export declare namespace AwsSTS {
  export type RoleRequest = AssumeRoleRequest;
  export type RoleResponse = AssumeRoleResponse;

  export interface Role3rdParty {
    roleArn: RoleRequest['RoleArn'];
    sessionName: RoleRequest['RoleSessionName'];
    externalId: RoleRequest['ExternalId'];
  }

  export interface Class {
    saveRole(role3rdParty: Role3rdParty): Promise<void>;
    assumeRole(): Promise<RoleResponse['Credentials'] | Error>;
  }
}
