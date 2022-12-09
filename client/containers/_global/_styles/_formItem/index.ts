import Styled from '@emotion/styled';

import { Form } from 'antd';

export const FormItemStyled = Styled(Form.Item)`
  .ant-form-item-required {
    color: #ffb700;
  }

  .ant-input:hover,
  .ant-input:focus,
  .ant-input-focused {
    border-color: #ffb700;
  }

  .ant-input-affix-wrapper {
    :hover,
    :focus {
      border-color: #ffb700;
    }
  }

  .ant-input-affix-wrapper-focused {
    border-color: #ffb700;
  }
`;

export default FormItemStyled;
