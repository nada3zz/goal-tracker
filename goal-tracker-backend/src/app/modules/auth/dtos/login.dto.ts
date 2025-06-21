import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(5)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(6)
  password: string;
}
