import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../user/validators/is-user-already-exist.validator';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  readonly password: string;
}
