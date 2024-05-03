import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Put,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { TodoEntity } from './entities/Todo.entity';
import { CreateTodoDto } from './dto/CreateTodo.dto';
import { UpdateTodoDto } from './dto/UpdateTodo.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@Controller('todos')
@ApiTags('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: TodoEntity })
  async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return await this.todosService.create(createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  async findAll(@Request() req: Request): Promise<TodoEntity[]> {
    const userId = req['user'].userId;
    return await this.todosService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TodoEntity })
  async update(
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TodoEntity> {
    const userId = req['user'].userId;
    return await this.todosService.update(id, userId, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Request() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const userId = req['user'].userId;
    await this.todosService.delete(id, userId);
  }
}
