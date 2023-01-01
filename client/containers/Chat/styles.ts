import { Card } from 'antd';
import Styled from '@emotion/styled';

export const CardStyled = Styled(Card)`
  border-left: 5px solid #DC3535;

  .ant-card-head {
    background-color: #DC3535;
    border-radius: 5px;
  }

  .ant-card-body {
    background-color: white;
    color: #DC3535;
    font-weight: bold;
    border-radius: 5px;
  }
`;
