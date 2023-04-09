import type { AwsSTS } from '@app/aws-sts/aws-sts.interface';

export const MockRole3rdParty: AwsSTS.Role3rdParty = {
  roleArn: '???',
  sessionName: '???',
  externalId: '???',
};

export class STS {
  assumeRole() {
    return {
      promise: jest.fn(() => {
        return {
          Credentials: {
            AccessKeyId: '???',
            SecretAccessKey: '???',
            SessionToken: '???',
            Expiration: new Date(),
          },
          $response: {
            error: false,
          },
        };
      }),
    };
  }
}

export class EC2 {
  createKeyPair() {
    return {
      promise: jest.fn(() => {
        return {
          KeyPairId: '???',
          KeyMaterial: '???',
          $response: {
            error: false,
          },
        };
      }),
    };
  }
  describeKeyPairs() {
    return {
      promise: jest.fn(() => {
        return {
          KeyPairs: [],
          $response: {
            error: false,
          },
        };
      }),
    };
  }
  deleteKeyPair() {
    return {
      promise: jest.fn(() => {
        return {
          $response: {
            error: false,
          },
        };
      }),
    };
  }
  runInstances() {
    return {
      promise: jest.fn(() => {
        return {
          Instances: [],
          $response: {
            error: false,
          },
        };
      }),
    };
  }
  describeInstances() {
    return {
      promise: jest.fn(() => {
        return {
          Reservations: [],
          $response: {
            error: false,
          },
        };
      }),
    };
  }
  terminateInstances() {
    return {
      promise: jest.fn(() => {
        return {
          TerminatingInstances: [],
          $response: {
            error: false,
          },
        };
      }),
    };
  }
}

export class S3 {
  upload() {
    return {
      promise: jest.fn(() => {
        return {
          Key: '???',
          Bucket: '???',
          $response: {
            error: false,
          },
        };
      }),
    };
  }

  getSignedUrlPromise() {
    return Promise.resolve('???');
  }

  getObject() {
    return {
      promise: jest.fn(() => {
        return {
          $response: {
            error: false,
          },
        };
      }),
    };
  }

  deleteObject() {
    return {
      promise: jest.fn(() => {
        return {
          $response: {
            error: false,
          },
        };
      }),
    };
  }
}
