import styled from '@emotion/styled';

export const Loading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 576px) {
    flexdirection: column;
  }
`;
