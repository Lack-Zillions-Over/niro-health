export const connection = {
  on: () => jest.fn(),
  getClient: () => {
    return {
      db: jest.fn(),
    };
  },
  close: () => jest.fn(),
};

export function connect() {
  return jest.fn();
}
