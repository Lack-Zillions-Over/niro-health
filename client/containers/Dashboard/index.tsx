import React from 'react';

import { Row, Col } from 'antd';

import * as Styles from '@/containers/Dashboard/styles';

import LayoutWithSession from '@/containers/_global/_pages/_layout-with-session';
import Menu from '@/containers/Dashboard/menu';

import useUser from '@/atom/user';

export default function Component() {
  const user = useUser();

  return (
    <LayoutWithSession menu={Menu}>
      <Row gutter={24}>
        <Col span={24}>
          <Styles.CardStyled>
            <p>Hello, {user.get().username}</p>
          </Styles.CardStyled>
        </Col>
      </Row>
    </LayoutWithSession>
  );
}
