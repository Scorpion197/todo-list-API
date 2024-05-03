import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private redis: Redis) {}

  async blackListToken(token: string): Promise<void> {
    await this.redis.set(`token:${token}`, token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const retrievedToken = await this.redis.get(`${token}`);
    return retrievedToken !== null;
  }
}
