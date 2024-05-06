import { CreateTodoDto } from './createTodo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
