import * as React from 'react';
import { atom, useRecoilState } from 'recoil';
import { v1 } from 'uuid';

import FileSchema from '@/schemas/files';
import useStorage from '@/cache/storage/files';

export const filesDataDefault: FileSchema[] = [];

const Files = atom<FileSchema[]>({
  key: `files-${Date.now}-${v1()}`,
  default: filesDataDefault,
});

export default function useFiles() {
  const [isInitial, setIsInitial] = React.useState(true);
  const [isLoadedFiles, setIsLoadedFiles] = React.useState(false);
  const [files, setFiles] = useRecoilState(Files);

  const { load, save, remove } = useStorage();

  React.useEffect(() => {
    const timeout = (() =>
      setTimeout(async () => {
        if (!isLoadedFiles) {
          const data = await load();

          if (data) {
            setFiles(data);
          } else {
            setFiles(filesDataDefault);
          }
        }

        setIsInitial(false);
        setIsLoadedFiles(true);
      }))();

    return () => clearTimeout(timeout);
  }, [isLoadedFiles, load, setFiles, files]);

  return {
    isLoaded: () => {
      return isLoadedFiles;
    },
    get: () => {
      return isInitial === true ? filesDataDefault : files;
    },
    append(newFile: FileSchema) {
      const updated = [...files, newFile] as FileSchema[];

      save(updated).finally(() => setFiles(updated));
    },
    splice(id: string) {
      const updated = files.filter((file) => file.id !== id) as FileSchema[];

      save(updated).finally(() => setFiles(updated));
    },
    set: (newFiles: FileSchema[]) => {
      return save(newFiles).finally(() => setFiles(newFiles));
    },
    update: (id: string, newFile: Partial<FileSchema>) => {
      const updated = files.map((file) => {
        if (file.id === id) {
          return { ...file, ...newFile };
        }
        return file;
      }) as FileSchema[];

      return save(updated).finally(() => setFiles(updated));
    },
    remove: () => {
      return remove().finally(() => setFiles(filesDataDefault));
    },
  } as const;
}
