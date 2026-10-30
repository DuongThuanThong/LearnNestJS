import type { Role, User } from '@prisma/client'

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}


export const toAppUser = ({
  id, fullName, email, role }: User): AppUser => ({
  id,
  fullName,
  email,
  role
});