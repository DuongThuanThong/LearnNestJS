import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CredentialsService } from '../users/credentials.service.js';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { type AppUser } from '../users/users.js';

@Controller('auth')
export class AuthController {
  constructor(
    // private readonly authService: AuthService,
    private readonly credentials: CredentialsService,
    private readonly tokens: TokenService,
  ) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() dto: RegisterDto) {
    const user = await this.credentials.register(dto);
    return {
      user,
      ...(await this.tokens.issue(user.id, { method: 'password' })),
    };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: LoginDto) {
    const user = await this.credentials.verify(dto.email, dto.password);

    if (!user) throw new UnauthorizedException('Invalid email or password');
    return {
      user,
      ...(await this.tokens.issue(user.id, { method: 'password' })),
    };
  }

  @Public()
  @Post('sign-out')
  @HttpCode(204)
  async signOut(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.tokens.revoke(dto.refreshToken);
  }

  @Post('sign-out-everywhere')
  @HttpCode(204)
  async signOutEverywhere(@CurrentUser() user: AppUser): Promise<void> {
    await this.tokens.revokeAll(user.id);
  }
  
  @Public()
  @Post('token/refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto) {
     return await this.tokens.refresh(dto.refreshToken)
  }

  @Get('me')
  me(@CurrentUser() user: AppUser) {
    return user;
  }
}
