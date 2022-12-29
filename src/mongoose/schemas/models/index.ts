import * as _ from 'lodash';

import ChatModels from '@/mongoose/schemas/models/chat';

export default _.concat([], ChatModels) as { entity: any; schema: any }[];
