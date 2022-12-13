import { Dispatch, SetStateAction } from 'react';
import type { AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';

import UserCookies from '@/cache/cookies/user';

declare type Headers = { [x: string]: string };
declare type Response<Data> = Data & { message?: string; statusCode?: number };

export default function HttpPost<Query, Data>(
  url: string,
  data: Query,
  setLoading: Dispatch<SetStateAction<boolean>>,
  options?: Partial<{ useToken: { userId: string } }>,
) {
  return new Promise((resolve) => {
    setLoading(true);

    const {
      login: { find },
    } = UserCookies();

    let headers: Headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `${process.env.NEXT_PUBLIC_APPLICATION_AUTHORIZATION}`,
    };

    if (options && options.useToken)
      headers = Object.assign(headers, {
        user_id: options.useToken.userId,
        token_value: find('token_value') as string,
        token_signature: find('token_signature') as string,
        token_revalidate_value: find('token_revalidate_value') as string,
        token_revalidate_signature: find(
          'token_revalidate_signature',
        ) as string,
      });

    axios
      .post(`${process.env.NEXT_PUBLIC_APPLICATION_URI}/${url}`, data, {
        headers,
      })
      .then(({ data }: AxiosResponse) => resolve({ ...data, statusCode: 200 }))
      .catch(({ response, status }: AxiosError) => {
        const {
          data: { message },
        } = response as { data: { message: string } };
        resolve({ statusCode: status, message } as Response<Data>);
      })
      .finally(() => setLoading(false));
  }) as Promise<Response<Data>>;
}
