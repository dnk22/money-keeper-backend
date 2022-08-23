import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';

export class SignIn {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
