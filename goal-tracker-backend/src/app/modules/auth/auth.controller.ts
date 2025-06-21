import { Body, Controller, Post } from '@nestjs/common';
import { userAuthService } from './service/userAuth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private userAuth: userAuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    return this.userAuth.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userAuth.login(loginDto);
  }
}
