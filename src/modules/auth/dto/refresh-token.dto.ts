import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is null' })
  refreshToken: string;
}