export class CreateUserDto {
  readonly name: string;
  readonly dateOfBirth?: Date;
  readonly address?: string;
  readonly gender?: string;
  readonly occupation?: string;
  readonly password: string;
  readonly email: string;
  readonly phone?: string;
  readonly is_premium?: boolean;
  readonly createdDate?: Date;
  readonly updatedDate?: Date;
}
