import { AppUser } from "../users/users.js";


// Set default object data type for the Users to the library package "@nestjs/authentication"
declare module '@nestjs/authentication' { 
  interface AuthenticationTypes{
    user: AppUser;
  }
}