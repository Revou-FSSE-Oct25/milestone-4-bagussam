import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.account.create({
      data: { ...data, userId },
    });
  }

  async findAllUserAccounts(userId: string) {
    return this.prisma.account.findMany({
      where: { userId }
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId }
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  // Update a bank account
  async update(id: string, userId: string, data: { accountNumber?: string }) {
    const account = await this.findOne(id, userId); // Ensure ownership
    if (!account) throw new NotFoundException('Account not found');

    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  // Delete a bank account
  async remove(id: string, userId: string) {
    const account = await this.findOne(id, userId); // Ensure ownership
    if (!account) throw new NotFoundException('Account not found');

    return this.prisma.account.delete({
      where: { id },
    });
  }
}