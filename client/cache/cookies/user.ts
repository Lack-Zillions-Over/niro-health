import { setCookie, getCookie, deleteCookie } from 'cookies-next';

import options from '@/cache/cookies/options';

export default function UserCookies() {
  return {
    login: {
      set: (
        token_value: string,
        token_signature: string,
        token_revalidate_value: string,
        token_revalidate_signature: string,
      ) => {
        setCookie('token_value', token_value, options);
        setCookie('token_signature', token_signature, options);
        setCookie('token_revalidate_value', token_revalidate_value, options);
        setCookie(
          'token_revalidate_signature',
          token_revalidate_signature,
          options,
        );
      },
      get: () => {
        return {
          token_value: getCookie('token_value', options),
          token_signature: getCookie('token_signature', options),
          token_revalidate_value: getCookie('token_revalidate_value', options),
          token_revalidate_signature: getCookie(
            'token_revalidate_signature',
            options,
          ),
        };
      },
      find: (key: string) => {
        return getCookie(key, options);
      },
      update: (key: string, value: string) => {
        setCookie(key, value, options);
      },
      prune: () => {
        deleteCookie('token_value', options);
        deleteCookie('token_signature', options);
        deleteCookie('token_revalidate_value', options);
        deleteCookie('token_revalidate_signature', options);
      },
    } as const,
  } as const;
}
