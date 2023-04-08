import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export declare namespace AwsConfiguration {
  export interface Class {
    apiVersion: string;
    region: ServiceConfigurationOptions['region'];
    httpOptions: ServiceConfigurationOptions['httpOptions'];
    credentials: ServiceConfigurationOptions['credentials'];
    options(): ServiceConfigurationOptions;
  }
}
