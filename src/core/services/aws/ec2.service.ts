import { Injectable } from '@nestjs/common';
import { awsConfiguration } from '@/core/constants';

import { STSAWService, Role3rdParty } from '@/core/services/aws/sts.service';

import * as EC2 from 'aws-sdk/clients/ec2';

@Injectable()
export class EC2AWService extends STSAWService {
  protected async client(role3rdParty: Role3rdParty) {
    const credentials = await this.assumeRole(role3rdParty);

    if (credentials instanceof Error) return new Error(credentials.message);

    const client = new EC2({
      ...awsConfiguration,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
        expireTime: credentials.Expiration,
      },
    });

    return client;
  }

  public async createKeyPair(
    key: EC2.CreateKeyPairRequest['KeyName'],
    role3rdParty: Role3rdParty,
  ): Promise<
    | {
        id: string;
        key: string;
      }
    | Error
  > {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.CreateKeyPairRequest = {
      KeyName: key,
    };

    const { $response, KeyPairId, KeyMaterial } = await client
      .createKeyPair(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    return { id: KeyPairId, key: KeyMaterial };
  }

  public async describeKeyPair(
    key: EC2.KeyPairName,
    role3rdParty: Role3rdParty,
  ): Promise<EC2.KeyPairList | Error> {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.DescribeKeyPairsRequest = {
      KeyNames: [key],
    };

    const { $response, KeyPairs } = await client
      .describeKeyPairs(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    return KeyPairs;
  }

  public async deleteKeyPair(
    key: EC2.DeleteKeyPairRequest['KeyName'],
    role3rdParty: Role3rdParty,
  ): Promise<boolean | Error> {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.DeleteKeyPairRequest = {
      KeyName: key,
    };

    const { $response } = await client.deleteKeyPair(params).promise();

    if ($response.error) return new Error($response.error.message);

    return true;
  }

  public async createInstance(
    imageId: EC2.RunInstancesRequest['ImageId'],
    instanceType: EC2.RunInstancesRequest['InstanceType'],
    keyName: EC2.RunInstancesRequest['KeyName'],
    role3rdParty: Role3rdParty,
  ): Promise<string[] | Error> {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.RunInstancesRequest = {
      ImageId: imageId,
      InstanceType: instanceType,
      KeyName: keyName,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'maintainer',
              Value: 'project',
            },
          ],
        },
      ],
      MinCount: 1,
      MaxCount: 1,
    };

    const { $response, Instances } = await client
      .runInstances(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    return Instances.map(({ InstanceId }) => InstanceId);
  }

  public async describeInstance(
    instanceId: EC2.InstanceId,
    role3rdParty: Role3rdParty,
  ): Promise<EC2.Reservation[] | Error> {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.DescribeInstancesRequest = {
      InstanceIds: [instanceId],
    };

    const { $response, Reservations } = await client
      .describeInstances(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    return Reservations;
  }

  public async terminateInstance(
    instanceId: EC2.InstanceId,
    key: EC2.DeleteKeyPairRequest['KeyName'],
    role3rdParty: Role3rdParty,
  ): Promise<boolean | Error> {
    const client = await this.client(role3rdParty);

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.TerminateInstancesRequest = {
      InstanceIds: [instanceId],
    };

    const { $response, TerminatingInstances } = await client
      .terminateInstances(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    if (TerminatingInstances.length > 0) {
      const deleted = await this.deleteKeyPair(key, role3rdParty);

      if (deleted instanceof Error) return new Error(deleted.message);

      return true;
    } else {
      return false;
    }
  }
}
