import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

import { GeoIP } from '@/core/types/geo-ip.type';

export class SessionValidateUser {
  static async execute(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.sessionValidate(
      id,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
    );
  }
}
