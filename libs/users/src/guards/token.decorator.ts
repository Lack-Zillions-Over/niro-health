import { SetMetadata } from '@nestjs/common';

export const Token = (use?: boolean) => SetMetadata('useToken', use);
