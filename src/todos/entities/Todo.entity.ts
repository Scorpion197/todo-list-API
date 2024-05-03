import { ApiProperty } from '@nestjs/swagger';
import { Todo, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class TodoEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
