import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { TodoQueryDto } from './dto/query.dto';

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

  describe('findAll', () => {
    it('should return todos from cache if available', async () => {
      const query: TodoQueryDto = { content: 'Test', sortBy: 'createdAt' };
      const cachedData = {
        data: [{ id: 1, content: 'Test Todo' }],
        nextCursor: null,
      };
      redisService.getCachedQuery.mockResolvedValue(cachedData);

      expect(await service.findAll(1, query, '5')).toEqual(cachedData);
    });

    it('should fetch todos from database and cache them if not in cache', async () => {
      const query: TodoQueryDto = { content: 'Test', sortBy: 'createdAt' };
      const dbData = [
        { id: 1, content: 'Test Todo' },
        { id: 2, content: 'Another Test Todo' },
      ];
      redisService.getCachedQuery.mockResolvedValue(null);
      prismaService.todo.findMany.mockResolvedValue(dbData);
      redisService.cacheQuery.mockResolvedValue(undefined); // Simulate caching

      const expectedResponse = { data: dbData, nextCursor: null };
      expect(await service.findAll(1, query, '2')).toEqual(expectedResponse);
      expect(redisService.cacheQuery).toHaveBeenCalledWith(
        query,
        expectedResponse,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto = { content: 'Updated Content' };
      const updatedTodo = { id: 1, userId: 1, content: 'Updated Content' };
      prismaService.todo.update.mockResolvedValue(updatedTodo);
      expect(await service.update(1, 1, updateTodoDto)).toEqual(updatedTodo);
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: updateTodoDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      prismaService.todo.delete.mockResolvedValue({ id: 1, userId: 1 });
      await service.delete(1, 1);
      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });
  });
});
