import type { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export interface IAwsConfigurationService {
  apiVersion: string;
  region: ServiceConfigurationOptions['region'];
  httpOptions: ServiceConfigurationOptions['httpOptions'];
  credentials: ServiceConfigurationOptions['credentials'];
  options(): ServiceConfigurationOptions;
}
