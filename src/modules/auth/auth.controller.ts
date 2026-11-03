import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CredentialsService } from '../users/credentials.service.js';
import { Public, TokenService } from '@nestjs/authentication';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly credentials: CredentialsService,
    private readonly tokens: TokenService,
  ) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() dto: RegisterDto) {
    const user = await this.credentials.register(dto);
    return {
      user,
      ...(await this.tokens.issue(user.id), { method: 'password' }),
    };
  }
}
