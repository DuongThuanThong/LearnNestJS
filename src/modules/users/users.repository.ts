import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { AppUser, toAppUser } from "./users.js";

// Chuẩn hóa email 
const normalize = (email: string) => email.trim().normalize('NFC').toLowerCase();
const PUBLIC_SELECT = {
  id: true, email: true, fullName: true, role: true
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) { };
  
  create(email: string,
    { fullName, password }: { fullName: string; password: string }
  ): Promise<AppUser>{
    return this.prisma.user.create({
      data: { email: normalize(email), fullName, password },
      select: PUBLIC_SELECT
    });
  }
  
  findById(id: string): Promise<AppUser | null>{
    return this.prisma.user.findUnique({ where: { id }, select: PUBLIC_SELECT });
  }

  findByEmail(email: string): Promise<AppUser | null>{
    return this.prisma.user.findUnique({where:{ email: normalize(email), select:PUBLIC_SELECT }});
  }

  async findCredentials(email: string): Promise<{user: AppUser; password: string | null } | null >{
    const row = await this.prisma.user.findUnique({
      where: { email: normalize(email) }
    })
    return row ? { user: toAppUser(row), password: row.password } : null;
  }

  async updatePassword(id: string, password: string): Promise<void>{
    await this.prisma.user.update({
      where: { id },
      data: {password}
    })
  }
} 