/**
 * @description Function for generate MongoDB URL.
 * @param params {
 *  username: string;
 *  password: string;
 *  host: string;
 *  port: string;
 *  database: string;
 *  appname: string;
 *  ssl: boolean;
 * }
 */
export function MongoDbURL(params: {
  username: string;
  password: string;
  host: string;
  port: string;
  database: string;
  appname: string;
  ssl: boolean;
}): string {
  return `mongodb://${params.username}:${encodeURIComponent(params.password)}@${
    params.host
  }:${params.port}/${
    params.database
  }?authSource=admin&readPreference=primary&appname=${
    params.appname
  }D&directConnection=true&ssl=${params.ssl}`;
}
