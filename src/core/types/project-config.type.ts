declare type AWSS3 = {
  bucket: string;
};

export type ProjectConfig = {
  locale: {
    main: string;
    languages: string[];
    path: string;
  };
  logs: {
    path: string;
  };
  email: {
    provider: 'aws' | 'smtp';
  };
  files: {
    path: string;
    avatar: {
      path: string;
      fieldname: string;
      mimetypes: string[];
      limit: number;
      aws: AWSS3;
    };
  };
  redis: {
    database: number;
  };
  aws: {
    apiVersion: string;
    region: string;
    httpsAgent: {
      maxSockets: number;
      keepAlive: boolean;
      keepAliveMsecs: number;
    };
  };
};
