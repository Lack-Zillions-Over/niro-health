import React from 'react';
import { useRouter } from 'next/router';

import * as Styles from '@/containers/_global/_components/_session-expired/styles';

import ButtonStyled from '@/containers/_global/_styles/_button';

import useUser from '@/atom/user'
import UserCookies from '@/cache/cookies/user';

declare interface Props {
  dark?: boolean;
}

export default function Component({ dark }: Props) {
  const router = useRouter();
  const user = useUser();
  const cookies = UserCookies();

  return (
    <Styles.ResultStyled
      status="403"
      title="Your session has been expired"
      subTitle="Please login again, to continue. Thank you 😉"
      className={dark ? 'dark' : ''}
      extra={<ButtonStyled type="primary" onClick={() => {
        user.remove();
        cookies.login.prune();
        router.push('/');
      }}>
        Login
      </ButtonStyled>}
    />
  );
};
