import { Injectable } from '@nestjs/common';
import { awsConfiguration } from '@/core/constants';

import * as MarketplaceMetering from 'aws-sdk/clients/marketplacemetering';

@Injectable()
export class MarketplaceMeteringAWService {
  private readonly client: MarketplaceMetering;

  constructor() {
    this.client = new MarketplaceMetering(awsConfiguration);
  }

  public async resolveCustomer(
    token: MarketplaceMetering.ResolveCustomerRequest['RegistrationToken'],
  ): Promise<MarketplaceMetering.ResolveCustomerResult | Error> {
    const params: MarketplaceMetering.ResolveCustomerRequest = {
      RegistrationToken: token,
    };

    const { $response, CustomerAWSAccountId, CustomerIdentifier, ProductCode } =
      await this.client.resolveCustomer(params).promise();

    if ($response.error) return new Error($response.error.message);

    return { CustomerAWSAccountId, CustomerIdentifier, ProductCode };
  }

  public async sendBatchMeterUsage(
    productCode: MarketplaceMetering.BatchMeterUsageRequest['ProductCode'],
    usageRecords: MarketplaceMetering.UsageRecord[],
  ): Promise<MarketplaceMetering.BatchMeterUsageResult | Error> {
    const params: MarketplaceMetering.BatchMeterUsageRequest = {
      ProductCode: productCode,
      UsageRecords: usageRecords,
    };

    const { $response, Results, UnprocessedRecords } = await this.client
      .batchMeterUsage(params)
      .promise();

    if ($response.error) return new Error($response.error.message);

    return { Results, UnprocessedRecords };
  }
}
