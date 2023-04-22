import type { Credentials, EC2, S3 } from 'aws-sdk';
import type { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import type { CredentialsOptions } from 'aws-sdk/lib/credentials';
import type { Role3rdParty } from '@app/aws-sts';

export type AssumeRoleResult = Promise<
  | ServiceConfigurationOptions
  | (ServiceConfigurationOptions & (Credentials | CredentialsOptions))
>;

export interface IAwsCoreServiceBase {
  configuration(): AssumeRoleResult;
}

export interface IAwsCoreService {
  setRole3rdParty(role3rdParty: Role3rdParty): Promise<void>;
  client(): Promise<EC2 | S3>;
}

export interface IAwsCoreServiceImpl
  extends IAwsCoreServiceBase,
    IAwsCoreService {}
