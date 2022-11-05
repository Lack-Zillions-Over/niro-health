import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';
import { User } from '@/users/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByUser {
  static async execute(
    filter: RecursivePartial<User>,
    similarity: SimilarityFilterTypes.SimilarityType,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.findBy(filter, similarity);
  }
}
