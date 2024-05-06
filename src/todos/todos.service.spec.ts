import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

const mockPrismaService = () => ({
  todo: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

const mockRedisService = () => ({
  getCachedQuery: jest.fn(),
  cacheQuery: jest.fn(),
});

describe('TodosService', () => {
  let service: TodosService;
  let prismaService;
  let redisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: PrismaService, useFactory: mockPrismaService },
        { provide: RedisService, useFactory: mockRedisService },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto = { userId: 1, content: 'Test Todo' };
      prismaService.todo.create.mockResolvedValue(createTodoDto);
      expect(await service.create(createTodoDto)).toEqual(createTodoDto);
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: createTodoDto,
      });
    });
  });
});
