import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositWithdrawDto, TransferDto } from './dto/transaction.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Deposit money to an account' })
  @Post(':accountId/deposit')
  async deposit(
    @Param('accountId') accountId: string,
    @Body() dto: DepositWithdrawDto,
  ) {
    return this.transactionsService.deposit(accountId, dto.amount);
  }

  @ApiOperation({ summary: 'Withdraw money from an account' })
  @Post(':accountId/withdraw')
  async withdraw(
    @Req() req,
    @Param('accountId') accountId: string,
    @Body() dto: DepositWithdrawDto,
  ) {
    return this.transactionsService.withdraw(accountId, req.user.id, dto.amount);
  }

  @ApiOperation({ summary: 'Transfer money to another account' })
  @Post(':accountId/transfer')
  async transfer(
    @Req() req,
    @Param('accountId') senderId: string,
    @Body() dto: TransferDto,
  ) {
    return this.transactionsService.transfer(
      senderId,
      req.user.id,
      dto.receiverAccountId,
      dto.amount,
    );
  }

  @ApiOperation({ summary: 'Get all user transactions' })
  @Get()
  async getMyTransactions(@Req() req) {
    return this.transactionsService.findAllUserTransactions(req.user.id);
  }

  @ApiOperation({ summary: 'Get transaction details' })
  @Get(':id')
  async getTransactionDetail(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.id);
  }
}