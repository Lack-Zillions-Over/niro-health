import React, { useState } from 'react';

import Guard from '@/guards/session';
import Layout from '@/components/layout';
import Menu from '@/containers/Home/menu';

import { MessagesNotification } from '@/constants/guard';

import ContainerWrapper from '@/containers/_global/_styles/_containerWrapper';
import Loading from '@/containers/_global/_components/_loading';

import InputLogin from '@/containers/Home/input-login';
import InputRegister from '@/containers/Home/input-register';

import SessionExpired from '@/containers/_global/_components/_session-expired';

import useUser from '@/atom/user';

export default function Component() {
  const [register, isRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const user = useUser();

  const { loading, isBlocked } = Guard({
    success: {
      notification: {
        enabled: true,
        title: 'Welcome',
        message: MessagesNotification.yourAlreadyLoggedIn,
      },
      redirectTo: '/dashboard',
    },
  });

  const toggleIsRegister = () => isRegister(!register);
  const toggleIsLogged = () => setIsLogged(!isLogged);

  const onMounted = () => (
    <ContainerWrapper>
      {!isLogged &&
        (isBlocked && user.get().id.length > 0 ? (
          <SessionExpired dark />
        ) : (
          user.get().id.length <= 0 &&
          (!register ? (
            <InputLogin
              toggleIsRegister={toggleIsRegister}
              toggleIsLogged={toggleIsLogged}
            />
          ) : (
            <InputRegister toggleIsRegister={toggleIsRegister} />
          ))
        ))}
    </ContainerWrapper>
  );

  const onLoading = () => <Loading />;

  return <Layout menu={Menu} content={!loading ? onMounted() : onLoading()} />;
}
