import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { CredentialsService } from './credentials.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository,CredentialsService],
  exports: [UsersRepository,CredentialsService]
})
export class UsersModule {}
