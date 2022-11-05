export class SessionValidateUserDto {
  id: string;
  token_value: string;
  token_signature: string;
  token_revalidate_value: string;
  token_revalidate_signature: string;
}
