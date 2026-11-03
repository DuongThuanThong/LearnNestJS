import { AuthenticationRegistry, JwtBearerProvider, JwtClaims } from "@nestjs/authentication";
import { UsersRepository } from "../users/users.repository.js";
import { Injectable } from "@nestjs/common";
import { AppUser } from "../users/users.js";
import { User } from "@prisma/client";

@Injectable()
export class JwtAuth extends JwtBearerProvider<AppUser> {

  constructor(
    private readonly usersRepository: UsersRepository,
    registry: AuthenticationRegistry,
  ) {
    // The key, issuer and audience come from the `accessToken` options.
    super({ realm: 'store' });
    registry.registerProvider(this, { order: 0 });
  }

  protected validate({sub}: JwtClaims){
    return sub ? this.usersRepository.findById(sub) : null;
  }
}