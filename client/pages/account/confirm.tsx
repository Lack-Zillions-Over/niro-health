import type { NextPage, NextPageContext } from 'next';
import * as _ from 'lodash';

export interface Props {
  token: string;
}

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;

  const token = query['token'] as string;

  const props: Props = { token };

  return {
    props: _.omitBy(props, _.isNil),
  };
}

import Container from '@/containers/Account/Confirm';

const Page: NextPage<Props> = ({ token }) => {
  return <Container token={token} />;
};

export default Page;
