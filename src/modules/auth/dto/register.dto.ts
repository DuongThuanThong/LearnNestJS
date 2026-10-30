import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";
import { IsPassword } from "../decorators/is-password.decorator.js";

export class RegisterDto{
  
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @IsPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}