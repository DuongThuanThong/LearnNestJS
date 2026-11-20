import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { PasswordHasher } from '@nestjs/authentication';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { AppUser } from './users.js';
@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(dto: RegisterDto): Promise<AppUser> {
    if (await this.usersRepository.findByEmail(dto.email)) {
      throw new ConflictException('The email already exists');
    }
    return this.usersRepository.create(dto.email, {
      fullName: dto.fullName,
      password: await this.passwordHasher.hash(dto.password)
    });
  }


  // Validates credentials and rehashes password if needed
  async verify(email: string, password: string): Promise<AppUser | null> {
    const found = await this.usersRepository.findCredentials(email)
    const validPassword = await this.passwordHasher.verify(password, found?.password)
    if (!validPassword || !found || !found.password) return null

    if (this.passwordHasher.needsRehash(found.password)) {
      await this.usersRepository.updatePassword(found.user.id, await this.passwordHasher.hash(password))
    }
    return found.user;
  }
  
}
