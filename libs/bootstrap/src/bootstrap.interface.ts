import { INestApplication } from '@nestjs/common';

export declare namespace Bootstrap {
  export interface Class {
    app: INestApplication;
    main(app: INestApplication): Promise<void>;
  }
  export type acceptFunc = () => void;
  export type disposeFunc = (param: () => Promise<void>) => void;
}
