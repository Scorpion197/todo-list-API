import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { TodoQueryDto } from 'src/todos/dto/query.dto';
import { TodoEntity } from 'src/todos/entities/Todo.entity';
interface CachedTodos {
  data: TodoEntity[];
  nextCursor: string;
}
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

  async cacheQuery(query: TodoQueryDto, data: CachedTodos): Promise<void> {
    const key: string = `key-${query?.content || ''}${query?.cursor || ''}${query?.sortBy || ''}${query?.sortOrder || ''}`;
    await this.redis.set(key, JSON.stringify(data));
  }

  async getCachedQuery(query: TodoQueryDto): Promise<CachedTodos> {
    const key: string = `key-${query?.content || ''}${query?.cursor || ''}${query?.sortBy || ''}${query?.sortOrder || ''}`;
    return (await this.redis.get(key)) as unknown as CachedTodos;
  }
}
