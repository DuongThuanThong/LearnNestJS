import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository.js";
import {PasswordHasher} from "@nestjs/authentication"
@Injectable()

export class CredntialsService{
  constructor(
    private readonly user: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }


}