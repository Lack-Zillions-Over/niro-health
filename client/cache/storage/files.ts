import localforage from 'localforage';

import FileSchema from '@/schemas/files';

const DATA_KEY = 'files';

export default function useStorage() {
  const load = async (): Promise<FileSchema[]> => {
      return (await localforage.getItem(DATA_KEY)) as FileSchema[];
    },
    save = async (data: FileSchema[]): Promise<FileSchema[]> => {
      return await localforage.setItem<FileSchema[]>(DATA_KEY, data);
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
