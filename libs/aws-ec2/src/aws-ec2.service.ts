import { Inject, Injectable } from '@nestjs/common';
import { EC2 } from 'aws-sdk';

import type {
  IAwsEc2Service,
  CreateKeyPairResponse,
  DescribeKeyPairResponse,
  DeleteKeyPairResponse,
  CreateInstanceResponse,
  DescribeInstanceResponse,
  TerminateInstanceResponse,
} from '@app/aws-ec2';
import type { IAwsCoreServiceImpl } from '@app/aws-core';
import type { Role3rdParty } from '@app/aws-sts';

/**
 * @description The module that provides the AWS EC2 service.
 */
@Injectable()
export class AwsEc2Service implements IAwsEc2Service {
  constructor(
    @Inject('IAwsCoreService')
    private readonly awsCoreService: IAwsCoreServiceImpl,
  ) {}

  /**
   * @description Get the AWS EC2 client.
   */
  public async client() {
    const configuration = await this.awsCoreService.configuration();
    const client = new EC2({
      ...configuration,
    });
    return client;
  }

  /**
   * @description Set the role 3rd party.
   */
  public async setRole3rdParty(role3rdParty: Role3rdParty): Promise<void> {
    await this.awsCoreService.setRole3rdParty(role3rdParty);
  }

  /**
   * @description Create a key pair.
   */
  public async createKeyPair(
    key: EC2.CreateKeyPairRequest['KeyName'],
  ): Promise<CreateKeyPairResponse> {
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

  /**
   * @description Describe a key pair.
   */
  public async describeKeyPair(
    key: EC2.KeyPairName,
  ): Promise<DescribeKeyPairResponse> {
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

  /**
   * @description Delete a key pair.
   */
  public async deleteKeyPair(
    key: EC2.DeleteKeyPairRequest['KeyName'],
  ): Promise<DeleteKeyPairResponse> {
    const client = await this.client();

    if (client instanceof Error) return new Error(client.message);

    const params: EC2.DeleteKeyPairRequest = {
      KeyName: key,
    };

    const { $response } = await client.deleteKeyPair(params).promise();

    if ($response.error) return new Error($response.error.message);

    return true;
  }

  /**
   * @description Create an instance.
   */
  public async createInstance(
    imageId: EC2.RunInstancesRequest['ImageId'],
    instanceType: EC2.RunInstancesRequest['InstanceType'],
    keyName: EC2.RunInstancesRequest['KeyName'],
  ): Promise<CreateInstanceResponse> {
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

  /**
   * @description Describe an instance.
   */
  public async describeInstance(
    instanceId: EC2.InstanceId,
  ): Promise<DescribeInstanceResponse> {
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

  /**
   * @description Terminate an instance.
   */
  public async terminateInstance(
    instanceId: EC2.InstanceId,
    key: EC2.DeleteKeyPairRequest['KeyName'],
  ): Promise<TerminateInstanceResponse> {
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
