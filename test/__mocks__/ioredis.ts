const mockData: Record<string, string | Buffer> = {};

const ioredis = jest.fn().mockImplementation(() => {
  return {
    keys: jest.fn(() => {
      return Promise.resolve(Object.keys(mockData));
    }),
    set: jest.fn((key: string, value: string) => {
      mockData[key] = value;
      return Promise.resolve('OK');
    }),
    get: jest.fn((key: string) => {
      return Promise.resolve(mockData[key]);
    }),
    setBuffer: jest.fn((key: string, value: Buffer) => {
      mockData[key] = value;
      return Promise.resolve(mockData[key]);
    }),
    getBuffer: jest.fn((key: string) => {
      return Promise.resolve(mockData[key]);
    }),
    del: jest.fn((key: string) => {
      delete mockData[key];
      return Promise.resolve(1);
    }),
    flushall: jest.fn(() => {
      const keys = Object.keys(mockData);
      for (const key of keys) {
        delete mockData[key];
      }
      return Promise.resolve('OK');
    }),
  };
});

export default ioredis;
