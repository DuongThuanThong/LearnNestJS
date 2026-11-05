import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidationOptions,
} from 'class-validator';

export function IsPassword(options?: ValidationOptions) {
  return applyDecorators(
    IsString(),
    MaxLength(128, { message: `Password too long` }),
    IsStrongPassword(
      { minLength: 12, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
      {
        message: `The password is too short; it must include uppercase letters, lowercase letters, numbers, and special characters.`,
        ...options,
      },
    ),
  );
}
