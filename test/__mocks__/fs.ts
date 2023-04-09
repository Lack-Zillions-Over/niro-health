const fs = jest.fn().mockImplementation(() => {
  const mockData: Record<string, string | Buffer> = {};

  return {
    writeFileSync: jest.fn((path: string, raw: string) => {
      return (mockData[path] = raw);
    }),
    existsSync: jest.fn((path: string) => {
      return mockData[path];
    }),
    readFileSync: jest.fn((path: string) => {
      return mockData[path];
    }),
    mkdirSync: jest.fn(),
    unlinkSync: jest.fn((path: string) => {
      delete mockData[path];
    }),
  };
});

export default fs;
