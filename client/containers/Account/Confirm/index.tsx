import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Row, Col, Spin, message } from 'antd';

import { Props } from '@/pages/account/confirm';

import ResultStyled from '@/containers/_global/_styles/_result';
import ButtonStyled from '@/containers/_global/_styles/_button';

import Layout from '@/components/layout';
import Menu from '@/containers/Account/menu';

import UserService from '@/services/users';

export default function Component({ token }: Props) {
  const [isActive, setIsActive] = useState<boolean>();

  const router = useRouter();
  const { loading, activate } = UserService();

  const onMounted = () => (
    <Row gutter={24} className="w-[100%] p-5">
      <Col
        span={24}
        className="flex flex-col items-center justify-center h-[100vh]"
      >
        {isActive === undefined && <Spin size="large" />}
        {isActive && (
          <ResultStyled
            status="success"
            title="Your account has been activated!"
            subTitle="You can now login with your account. Thank you for joining us!"
            extra={[
              <ButtonStyled
                type="primary"
                key="signIn"
                onClick={() => router.replace('/')}
              >
                Sign in
              </ButtonStyled>,
            ]}
          />
        )}
        {isActive === false && (
          <ResultStyled
            status="error"
            title="Activation failed"
            subTitle={
              <>
                <p>
                  Please try again later. If the problem persists, please
                  contact us. Thank you!
                  <br />
                  <b>luizgp120@hotmail.com</b>
                </p>
              </>
            }
            extra={[
              <ButtonStyled
                type="primary"
                key="goBack"
                onClick={() => router.replace('/')}
              >
                Go back
              </ButtonStyled>,
            ]}
          />
        )}
      </Col>
    </Row>
  );

  const onLoading = () => <Spin />;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isActive === undefined) {
        activate(token)
          .then(() => {
            message.success(`Your account has been activated!`);
            setIsActive(true);
          })
          .catch((error) => {
            message.error(error.message);
            setIsActive(false);
          });
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [activate, isActive, token]);

  return <Layout menu={Menu} content={!loading ? onMounted() : onLoading()} />;
}
