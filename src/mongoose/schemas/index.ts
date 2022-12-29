import { ModelDefinition } from '@nestjs/mongoose';

import Schemas from '@/mongoose/schemas/models';

const models = [] as ModelDefinition[];

for (const document of Schemas) {
  if (
    Object.prototype.hasOwnProperty.call(document, 'entity') &&
    Object.prototype.hasOwnProperty.call(document, 'schema')
  ) {
    models.push({
      name: document.entity.name,
      schema: document.schema,
    });
  }
}

export default models;
