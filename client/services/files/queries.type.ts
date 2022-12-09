import FileSchema from '@/schemas/files';

declare namespace Queries {
  export namespace FindAll {
    export type Query = {
      limit?: number;
      offset?: number;
    };
    export type Data = FileSchema[];
  }
}

export default Queries;
