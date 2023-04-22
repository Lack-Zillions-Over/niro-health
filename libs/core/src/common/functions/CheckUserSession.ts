import { INestApplication } from '@nestjs/common';
import { FindByIdUserFactory } from '@app/users/factories/findById';
import { User } from '@app/users/entities';

export default async function CheckUserSession(
  params: {
    user_id: string;
    token_value: string;
    token_signature: string;
    token_revalidate_value: string;
    token_revalidate_signature: string;
  },
  app: INestApplication,
): Promise<boolean> {
  const data = await FindByIdUserFactory.run(params.user_id, app);

  if (data instanceof Error || !data.session) return false;

  const user = new User(data);

  const token = user.session.accessTokens.find(
      (token) =>
        token.value === params.token_value &&
        token.signature === params.token_signature,
    ),
    revalidateToken = (() => {
      if (!user.session.accessTokenRevalidate) return null;

      if (
        user.session.accessTokenRevalidate.value ===
          params.token_revalidate_value &&
        user.session.accessTokenRevalidate.signature ===
          params.token_revalidate_signature
      ) {
        return user.session.accessTokenRevalidate;
      }

      return null;
    })();

  if (!token || !revalidateToken) return false;

  if (
    new Date(token.expireIn) < new Date() &&
    new Date(revalidateToken.expireIn) < new Date()
  ) {
    return false;
  }

  return true;
}
