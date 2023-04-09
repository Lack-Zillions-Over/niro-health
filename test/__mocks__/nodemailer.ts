export const createTransport = jest.fn().mockReturnValue({
  verify: jest.fn((callback) => {
    return callback(false, `Mock Nodemailer: Method Verify`);
  }),
  use: jest.fn(),
  sendMail: jest.fn((_, callback) => {
    return callback(false, `Mock Nodemailer: Method SendMail`);
  }),
});
