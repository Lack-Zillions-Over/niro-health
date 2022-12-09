import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { notification } from 'antd';

import UserCookies from '@/cache/cookies/user';
import UserService from '@/services/users';
import useUser from '@/atom/user';

declare type Params = Partial<{
  success: Partial<{
    notification: {
      enabled: boolean;
      title: string;
      message: string;
    };
    redirectTo: string;
  }>;
  fallback: Partial<{
    notification: {
      enabled: boolean;
      title: string;
      message: string;
    };
    redirectTo: string;
  }>;
  delay: number;
}>;

export default function Guard(params: Params) {
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  const router = useRouter();
  const user = useUser();

  const { session_validate } = UserService();
  const { login: cookies } = UserCookies();

  useEffect(() => {
    const timeout = (() => {
      return setTimeout(() => {
        if (loading && user.isLoaded()) {
          setLoading(false);

          const {
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
          } = cookies.get();

          if (
            !token_value ||
            !token_signature ||
            !token_revalidate_value ||
            !token_revalidate_signature
          ) {
            setIsBlocked(true);

            if (
              params.fallback &&
              params.fallback.notification &&
              params.fallback.notification.enabled
            )
              notification.error({
                message: params.fallback.notification.title,
                description: params.fallback.notification.message,
              });

            if (params.fallback && params.fallback.redirectTo)
              router.replace(params.fallback.redirectTo);
          } else {
            session_validate(user.get().id)
              .then(() => {
                if (
                  params.success &&
                  params.success.notification &&
                  params.success.notification.enabled
                )
                  notification.success({
                    message: params.success.notification.title,
                    description: params.success.notification.message,
                  });

                if (params.success && params.success.redirectTo)
                  router.replace(params.success.redirectTo);
              })
              .catch(() => setIsBlocked(true));
          }
        }
      }, params.delay || 0);
    })();

    return () => clearTimeout(timeout);
  }, [router, loading, cookies, params, session_validate, user]);

  return { isBlocked, loading } as const;
}
