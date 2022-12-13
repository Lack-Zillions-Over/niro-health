import React, { useEffect } from 'react';

import { Row, Col } from 'antd';

import * as Styles from '@/containers/Dashboard/styles';

import LayoutWithSession from '@/containers/_global/_pages/_layout-with-session';
import Menu from '@/containers/Dashboard/menu';

import useUser from '@/atom/user';
import { useSocket } from '@/context/websockets';

import { WebSocketsResponse } from '@/common/websockets-response.type';

export default function Component() {
  const user = useUser();
  const socket = useSocket();

  useEffect(() => {
    socket?.on('rooms:create:response', (data: WebSocketsResponse<string>) =>
      console.log(data),
    );

    return () => {
      socket?.off('rooms:create:response');
    };
  }, [socket]);

  return (
    <LayoutWithSession menu={Menu}>
      <Row gutter={24}>
        <Col span={24}>
          <Styles.CardStyled>
            <p>Hello, {user.get().username}</p>
            <button
              onClick={() => socket?.emit('rooms:create', 'My Niro Heart')}
            >
              Test
            </button>
          </Styles.CardStyled>
        </Col>
      </Row>
    </LayoutWithSession>
  );
}
