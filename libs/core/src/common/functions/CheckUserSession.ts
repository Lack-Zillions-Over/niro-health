import { FindByIdUserFactory } from '@app/users/factories/findById';
import { User } from '@app/users/entities';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { RandomStringService } from '@app/random';
import { StringExService } from '@app/string-ex';
import { CryptoService } from '@app/crypto';
import { I18nService } from '@app/i18n';
import { JsonWebTokenService } from '@app/json-web-token';
import { SimilarityFilterService } from '@app/similarity-filter';

export default async function CheckUserSession(
  params: {
    user_id: string;
    token_value: string;
    token_signature: string;
    token_revalidate_value: string;
    token_revalidate_signature: string;
  },
  randomStringService: RandomStringService,
  stringExService: StringExService,
  cryptoService: CryptoService,
  i18n: I18nService,
  jsonWebTokenService: JsonWebTokenService,
  similarityFilterService: SimilarityFilterService,
  prismaService: PrismaService,
): Promise<boolean> {
  const data = await FindByIdUserFactory.run(
    params.user_id,
    randomStringService,
    stringExService,
    cryptoService,
    i18n,
    jsonWebTokenService,
    similarityFilterService,
    prismaService,
  );

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
