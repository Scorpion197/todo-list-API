import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';
import { TodoQueryDto } from './dto/query.dto';
import { TodoEntity } from './entities/Todo.entity';
import { TodoQueryEntity } from './entities/TodoList.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TodosService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return await this.prismaService.todo.create({ data: createTodoDto });
  }

  async findAll(
    userId: number,
    query: TodoQueryDto,
    pageSize: string,
  ): Promise<TodoQueryEntity> {
    const data = await this.redisService.getCachedQuery(query);
    if (data) {
      return data;
    }
    const numPageSize = parseInt(pageSize) || 5;
    const whereClause: Prisma.TodoWhereInput = {};

    whereClause.userId = userId;

    if (query.content) {
      whereClause.content = { contains: query.content };
    }

    const orderBy: object = query.sortBy
      ? { [query.sortBy]: query.sortOrder || 'asc' }
      : { createdAt: 'asc' };

    const todos = await this.prismaService.todo.findMany({
      where: whereClause,
      cursor: query.cursor ? { id: parseInt(query.cursor) } : undefined,
      take: numPageSize + 1,
      orderBy: orderBy,
    });

    let nextCursor: string | null = null;

    if (todos.length > numPageSize) {
      nextCursor = todos.pop().id.toString(); // Pop the extra item to maintain page size
    }
    await this.redisService.cacheQuery(query, { data: todos, nextCursor });
    return {
      data: todos,
      nextCursor,
    };
  }

  async update(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return await this.prismaService.todo.update({
      where: {
        id,
        userId,
      },
      data: updateTodoDto,
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.prismaService.todo.delete({ where: { id, userId } });
  }
}
