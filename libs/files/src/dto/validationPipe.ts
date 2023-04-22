export class FileValidationPipeDto {
  success: boolean;
  data: Express.Multer.File;
  mimetypes: string[];
}
