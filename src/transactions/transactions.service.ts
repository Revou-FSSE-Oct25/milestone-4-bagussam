import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(accountId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Jumlah harus lebih dari 0');

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } }
      }),
      this.prisma.transaction.create({
        data: { type: 'DEPOSIT', amount, receiverAccountId: accountId }
      })
    ]);
  }

  async withdraw(accountId: string, userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Jumlah harus lebih dari 0');

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({ where: { id: accountId } });
      
      if (!account) throw new BadRequestException('Akun tidak ditemukan');
      if (account.userId !== userId) throw new UnauthorizedException('Ini bukan akun Anda');
      
      if (Number(account.balance) < amount) throw new BadRequestException('Saldo tidak mencukupi');

      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } }
      });

      return tx.transaction.create({
        data: { type: 'WITHDRAWAL', amount, senderAccountId: accountId }
      });
    });
  }

  async transfer(senderId: string, userId: string, receiverId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Jumlah harus lebih dari 0');
    if (senderId === receiverId) throw new BadRequestException('Tidak bisa transfer ke akun yang sama');

    return this.prisma.$transaction(async (tx) => {
      const senderAccount = await tx.account.findUnique({ where: { id: senderId } });
      
      if (!senderAccount) throw new BadRequestException('Akun pengirim tidak ditemukan');
      if (senderAccount.userId !== userId) throw new UnauthorizedException('Ini bukan akun Anda');
      
      if (Number(senderAccount.balance) < amount) throw new BadRequestException('Saldo tidak mencukupi');

      await tx.account.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });

      await tx.account.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } }
      });

      return tx.transaction.create({
        data: {
          type: 'TRANSFER',
          amount,
          senderAccountId: senderId,
          receiverAccountId: receiverId,
        }
      });
    });
  }

  // View list of user transactions
  async findAllUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccount: { userId: userId } },
          { receiverAccount: { userId: userId } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // View specific transaction detail
  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: id,
        OR: [
          { senderAccount: { userId: userId } },
          { receiverAccount: { userId: userId } }
        ]
      },
      include: {
        senderAccount: { select: { accountNumber: true } },
        receiverAccount: { select: { accountNumber: true } }
      }
    });

    if (!transaction) throw new NotFoundException('Transaction not found or unauthorized');
    return transaction;
  }
}