import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [RedisModule, PrismaModule, JwtModule, RedisModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
