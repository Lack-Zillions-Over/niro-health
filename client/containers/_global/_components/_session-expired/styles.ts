import styled from "@emotion/styled";
import { Result } from 'antd';

export const ResultStyled = styled(Result)`
  &.dark {
    .ant-result-title {
      color: rgb(255, 183, 0);
    }

    .ant-result-subtitle {
      color: #dedede;
      opacity: 0.45;
    }
  }
`
