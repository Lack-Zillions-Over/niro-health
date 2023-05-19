import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema, ArraySchema } from 'joi';

/**
 * @description This pipe is responsible for validating the request body.
 */
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema | ArraySchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);

    if (error)
      throw new BadRequestException(
        `Validation failed: ${error.details
          .map(({ message }) => message)
          .join('\n\r')}`,
      );

    return value;
  }
}
