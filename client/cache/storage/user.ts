import localforage from 'localforage';

import UserSchema from '@/schemas/users';

const DATA_KEY = 'user';

export default function useStorage() {
  const load = async (): Promise<UserSchema | null> => {
      return await localforage.getItem<UserSchema>(DATA_KEY);
    },
    save = async (data: UserSchema): Promise<UserSchema> => {
      return await localforage.setItem<UserSchema>(DATA_KEY, data);
    },
    remove = async (): Promise<void> => {
      await localforage.removeItem(DATA_KEY);
    };

  return {
    load,
    save,
    remove,
  } as const;
}
