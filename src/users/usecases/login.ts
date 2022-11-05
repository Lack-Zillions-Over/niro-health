import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

import { GeoIP } from '@/core/types/geo-ip.type';

export class LoginUser {
  static async execute(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.login(email, password, device_name, geo_ip);
  }
}
