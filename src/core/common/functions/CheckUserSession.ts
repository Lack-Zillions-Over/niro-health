import { FindByIdUserFactory } from '@/users/factories/findById';
import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export default async function CheckUserSession(
  params: {
    user_id: string;
    token_value: string;
    token_signature: string;
    token_revalidate_value: string;
    token_revalidate_signature: string;
  },
  prismaService: PrismaService,
  libsService: LibsService,
  utilsService: UtilsService,
): Promise<boolean> {
  const user = await FindByIdUserFactory.run(
    params.user_id,
    prismaService,
    libsService,
    utilsService,
  );

  if (user instanceof Error || !user.session) return false;

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
