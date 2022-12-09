import { useRouter } from 'next/router';
import { message } from 'antd';

import useUser from '@/atom/user';
import UserService from '@/services/users';

export default function useLogout() {
  const { logout } = UserService();

  const user = useUser();
  const router = useRouter();

  const exec = () => {
    const id = user.get().id;

    if (id)
      logout(id)
        .then(() => {
          user.remove();
          router.push('/');
        })
        .catch((error) => message.error(error.message));
  };

  return {
    exec,
  } as const;
}
