import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { PrismaAuthenticationStore } from './prisma-authentication.store.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [PrismaAuthenticationStore, JwtAuth],
})
export class AuthModule {}


