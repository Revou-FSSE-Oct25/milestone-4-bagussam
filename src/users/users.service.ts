import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Get own profile (Customer)
  async findProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    const { password, ...result } = user; // Hide password
    return result;
  }

  // 2. Update own profile (Customer)
  async updateProfile(userId: string, data: { fullName?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data
    });
    
    const { password, ...result } = user; // Hide password
    return result;
  }

  // 3. Find All & Search (Extension service for ADMIN)
  async findAll(search?: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } }
        ]
      },
      // Only select safe data, NEVER select password
      select: { 
        id: true, 
        email: true, 
        fullName: true, 
        role: true, 
        createdAt: true 
      } 
    });
  }
}