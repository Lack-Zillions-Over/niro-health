import * as React from 'react';
import { atom, useRecoilState } from 'recoil';
import { v1 } from 'uuid';

import UserSchema from '@/schemas/users';
import useStorage from '@/cache/storage/user';

export const userDataDefault: UserSchema = {
  id: '',
  username: '',
  roles: [],
  session: {
    geoip: [],
    history: {
      devices: [],
      accessTokensCanceled: [],
      loginInNewIpAddressAlerts: [],
    },
    allowedDevices: [],
    activeClients: 0,
    limitClients: 0,
    banned: false,
    accessTokens: [],
    accessTokenRevalidate: {
      value: '',
      signature: '',
      ipAddress: '',
      expireIn: '',
      createdAt: '',
    },
    ipAddressBlacklist: [],
    ipAddressWhitelist: [],
    loginFailure: {
      attemptsCount: 0,
      attemptsLimit: 0,
      attemptsTimeout: '',
    },
  },
  activate: false,
  files: [],
  createdAt: '',
  updatedAt: '',
};

const User = atom<UserSchema>({
  key: `user-${Date.now}-${v1()}`,
  default: userDataDefault,
});

export default function useUser() {
  const [isInitial, setIsInitial] = React.useState(true);
  const [isLoadedUser, setIsLoadedUser] = React.useState(false);
  const [user, setUser] = useRecoilState(User);

  const { load, save, remove } = useStorage();

  React.useEffect(() => {
    const timeout = (() =>
      setTimeout(async () => {
        if (!isLoadedUser) {
          const data = await load();

          if (data) {
            setUser(data);
          } else {
            setUser(userDataDefault);
          }
        }

        setIsInitial(false);
        setIsLoadedUser(true);
      }))();

    return () => clearTimeout(timeout);
  }, [isLoadedUser, load, setUser, user]);

  return {
    isLoaded: () => {
      return isLoadedUser;
    },
    get: () => {
      return isInitial === true ? userDataDefault : user;
    },
    set: (newUser: UserSchema) => {
      return save(newUser).finally(() => setUser(newUser));
    },
    update: (newUser: Partial<UserSchema>) => {
      const updated = { ...user, ...newUser };

      return save(updated).finally(() => setUser(updated));
    },
    remove: () => {
      return remove().finally(() => setUser(userDataDefault));
    },
  } as const;
}
