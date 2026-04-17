import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(accountId: string, amount: number) {
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

  async transfer(senderId: string, receiverId: string, amount: number) {
    // A Prisma Transaction guarantees all of these happen, or none of them do.
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify sender has enough balance
      const senderAccount = await tx.account.findUnique({ where: { id: senderId } });
      if (!senderAccount || senderAccount.balance < amount) {
        throw new BadRequestException('Insufficient funds or invalid sender account');
      }

      // 2. Decrement sender's balance
      await tx.account.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });

      // 3. Increment receiver's balance
      await tx.account.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } }
      });

      // 4. Record the transaction
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
}