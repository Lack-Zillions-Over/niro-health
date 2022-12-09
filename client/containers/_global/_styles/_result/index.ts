import Styled from '@emotion/styled';

import { Result } from 'antd';


export const ResultStyled = Styled(Result)`
  .ant-result-title {
      color: rgb(255, 183, 0);
    }

  .ant-result-subtitle {
    color: #dedede;
    opacity: 0.45;
  }
`;

export default ResultStyled;
