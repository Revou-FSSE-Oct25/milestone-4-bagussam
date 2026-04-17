import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes Prisma available to all other modules automatically
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This allows other modules to use the service
})
export class PrismaModule {}