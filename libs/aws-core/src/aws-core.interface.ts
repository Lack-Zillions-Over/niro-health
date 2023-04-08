import type { Credentials, EC2, S3 } from 'aws-sdk';
import type { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import type { CredentialsOptions } from 'aws-sdk/lib/credentials';
import type { AwsSTS } from '@app/aws-sts/aws-sts.interface';

export declare namespace AwsCore {
  export type Role3rdParty = AwsSTS.Role3rdParty;
  export type AssumeRoleResult = Promise<
    | ServiceConfigurationOptions
    | (ServiceConfigurationOptions & (Credentials | CredentialsOptions))
  >;

  export interface Class {
    configuration(): AssumeRoleResult;
  }

  export abstract class Base {
    setRole3rdParty(role3rdParty: Role3rdParty): Promise<void>;
  }

  export abstract class Service extends Base {
    abstract client(): Promise<EC2 | S3>;
  }
}
