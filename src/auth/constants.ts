export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15s',
  revalidateExpiresIn: '5m',
};
