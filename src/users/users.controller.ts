import { Controller, Get, Patch, Body, Req, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get own user profile' })
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findProfile(req.user.id);
  }

  @ApiOperation({ summary: 'Update own user profile' })
  @Patch('profile')
  async updateProfile(@Req() req, @Body() body: { fullName?: string }) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @ApiOperation({ summary: 'Find all users (Admin only)' })
  @Roles('ADMIN')
  @Get('all')
  async getAllUsers(@Query('search') search: string) {
    return this.usersService.findAll(search);
  }
}