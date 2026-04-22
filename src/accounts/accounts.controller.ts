import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Accounts') // Adds Swagger Tag
@ApiBearerAuth()     // Tells Swagger this needs a JWT token
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create a new bank account' })
  @Post()
  async createAccount(@Req() req, @Body() body: { accountNumber: string }) {
    return this.accountsService.create(req.user.id, body);
  }

  @ApiOperation({ summary: 'Get all my bank accounts' })
  @Get()
  async getMyAccounts(@Req() req) {
    return this.accountsService.findAllUserAccounts(req.user.id);
  }

  @ApiOperation({ summary: 'Update specific bank account' })
  @Patch(':id')
  async updateAccount(@Req() req, @Param('id') id: string, @Body() body: { accountNumber: string }) {
    return this.accountsService.update(id, req.user.id, body);
  }

  @ApiOperation({ summary: 'Delete specific bank account' })
  @Delete(':id')
  async deleteAccount(@Req() req, @Param('id') id: string) {
    return this.accountsService.remove(id, req.user.id);
  }
}