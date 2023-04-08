import { Injectable } from '@nestjs/common';
import { EC2 } from 'aws-sdk';

import type { AwsCore } from '@app/aws-core/aws-core.interface';
import { AwsCoreService } from '@app/aws-core';
import { AwsEc2 } from '@app/aws-ec2/aws-ec2.interface';

@Injectable()
export class AwsEc2Service implements AwsCore.Service, AwsEc2.Class {
  constructor(private readonly awsCore: AwsCoreService) {}

  public async client() {
    const configuration = await this.awsCore.configuration();
    const client = new EC2({
      ...configuration,
    });
    return client;
  }

  public async setRole3rdParty(
    role3rdParty: AwsCore.Role3rdParty,
  ): Promise<void> {
    await this.awsCore.setRole3rdParty(role3rdParty);
  }

  public async createKeyPair(
    key: EC2.CreateKeyPairRequest['KeyName'],
  ): Promise<AwsEc2.CreateKeyPairResponse> {
    const client = await this.client();

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
  ): Promise<AwsEc2.DescribeKeyPairResponse> {
    const client = await this.client();

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
  ): Promise<AwsEc2.DeleteKeyPairResponse> {
    const client = await this.client();

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
  ): Promise<AwsEc2.CreateInstanceResponse> {
    const client = await this.client();

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
  ): Promise<AwsEc2.DescribeInstanceResponse> {
    const client = await this.client();

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
  ): Promise<AwsEc2.TerminateInstanceResponse> {
    const client = await this.client();

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.TerminateInstancesRequest = {
      InstanceIds: [instanceId],
    };

    const { $response, TerminatingInstances } = await client
      .terminateInstances(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    if (TerminatingInstances.length > 0) {
      const deleted = await this.deleteKeyPair(key);

      if (deleted instanceof Error) return new Error(deleted.message);

      return true;
    } else {
      return false;
    }
  }
}
