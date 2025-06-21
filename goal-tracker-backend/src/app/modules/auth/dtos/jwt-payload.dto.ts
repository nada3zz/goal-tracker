import { IsNumber, IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  id: string;
  @IsString()
  email: string;
  @IsNumber()
  iat: number;
  @IsNumber()
  exp: number;
}
