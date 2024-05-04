import { ApiProperty } from '@nestjs/swagger';
import { TodoEntity } from './Todo.entity';
export class TodoQueryEntity {
  @ApiProperty()
  data: TodoEntity[];

  @ApiProperty()
  nextCursor: string;
}
