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
  Query,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { TodoEntity } from './entities/Todo.entity';
import { CreateTodoDto } from './dto/CreateTodo.dto';
import { UpdateTodoDto } from './dto/UpdateTodo.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { TodoQueryDto } from './dto/query.dto';
import { TodoQueryEntity } from './entities/TodoList.entity';

@Controller('todos')
@ApiTags('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TodoEntity })
  async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return await this.todosService.create(createTodoDto);
  }

  // this endpoint can be queried like this:
  //https://API_URL/todos?content=meeting&sortBy=createdAt&sortOrder=desc&cursor=456&pageSize=10
  @UseGuards(JwtAuthGuard)
  @Get()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  async findAll(
    @Request() req: Request,
    @Query('pageSize') pageSize: string,
    @Query() queryDto: TodoQueryDto,
  ): Promise<TodoQueryEntity> {
    const userId = req['user'].userId;
    return await this.todosService.findAll(userId, queryDto, pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
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
  @Version('1')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Request() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const userId = req['user'].userId;
    await this.todosService.delete(id, userId);
  }
}
