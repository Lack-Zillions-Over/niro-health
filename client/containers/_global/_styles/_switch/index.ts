import Styled from '@emotion/styled';

import {Switch} from 'antd'

export const SwitchStyled = Styled(Switch)`
  &.ant-switch {
    background: #ff4a4a;
  }

  &.ant-switch-checked {
    background: #ffb700;
  }
`;

export default SwitchStyled;
