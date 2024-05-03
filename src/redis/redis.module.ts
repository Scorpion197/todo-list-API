import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as RedisConfigModule } from '@svtslv/nestjs-ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisConfigModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          db: +configService.get('REDIS_DB'),
        },
        connection: 'default',
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  constructor(private configService: ConfigService) {}
}
