import Styled from '@emotion/styled';

export const ContainerWrapper = Styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 576px) {
    flexdirection: column;
  }
`;

export default ContainerWrapper;
