import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(2)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @MinLength(5)
  email: string;

  @IsString()
  @IsStrongPassword(
    {},
    {
      message:
        'The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    },
  )
  @Length(8, 18)
  password: string;
}
