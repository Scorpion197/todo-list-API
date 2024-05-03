import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/CreateTodo.dto';
import { UpdateTodoDto } from './dto/UpdateTodo.dto';
import { TodoEntity } from './entities/Todo.entity';
@Injectable()
export class TodosService {
  constructor(private prismaService: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return await this.prismaService.todo.create({ data: createTodoDto });
  }

  async findAll(userId: number): Promise<TodoEntity[]> {
    return await this.prismaService.todo.findMany({ where: { userId } });
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
