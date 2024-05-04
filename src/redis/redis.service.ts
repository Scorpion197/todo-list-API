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
    const keyExpirationTime: number = parseInt(
      this.configService.get<string>('REDIS_KEY_EXPIRATION_TIME'),
    );
    await this.redis.set(`token:${token}`, token, 'EX', keyExpirationTime);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const retrievedToken = await this.redis.get(`token:${token}`);
    return retrievedToken !== null;
  }
}
