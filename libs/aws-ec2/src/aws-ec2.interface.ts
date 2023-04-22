import type { EC2 } from 'aws-sdk';
import type { Role3rdParty } from '@app/aws-sts';
import type { IAwsCoreService } from '@app/aws-core';

export type CreateKeyPairResponse =
  | {
      id: string;
      key: string;
    }
  | Error;
export type DescribeKeyPairResponse = EC2.KeyPairList | Error;
export type DeleteKeyPairResponse = boolean | Error;
export type CreateInstanceResponse = string[] | Error;
export type DescribeInstanceResponse = EC2.Reservation[] | Error;
export type TerminateInstanceResponse = boolean | Error;

export interface IAwsEc2Service extends IAwsCoreService {
  setRole3rdParty(role3rdParty: Role3rdParty): Promise<void>;
  createKeyPair(
    key: EC2.CreateKeyPairRequest['KeyName'],
  ): Promise<CreateKeyPairResponse>;

  describeKeyPair(key: EC2.KeyPairName): Promise<DescribeKeyPairResponse>;

  deleteKeyPair(
    key: EC2.DeleteKeyPairRequest['KeyName'],
  ): Promise<DeleteKeyPairResponse>;

  createInstance(
    imageId: EC2.RunInstancesRequest['ImageId'],
    instanceType: EC2.RunInstancesRequest['InstanceType'],
    keyName: EC2.RunInstancesRequest['KeyName'],
  ): Promise<CreateInstanceResponse>;

  describeInstance(
    instanceId: EC2.InstanceId,
  ): Promise<DescribeInstanceResponse>;

  terminateInstance(
    instanceId: EC2.InstanceId,
    key: EC2.DeleteKeyPairRequest['KeyName'],
  ): Promise<TerminateInstanceResponse>;
}
