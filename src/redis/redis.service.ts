import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private redis: Redis,
    private configService: ConfigService,
  ) {}

  async blackListToken(token: string): Promise<void> {
    //delete token in memory after expiration time is elapsed to avoid unecessary storage in redis
    const tokenExpirationTime: number = parseInt(
      this.configService.get<string>('REDIS_TOKEN_EXPIRATION_TIME'),
    );

    await this.redis.set(`token:${token}`, token, 'EX', tokenExpirationTime);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const retrievedToken: string = await this.redis.get(`token:${token}`);
    return retrievedToken !== null;
  }
}
