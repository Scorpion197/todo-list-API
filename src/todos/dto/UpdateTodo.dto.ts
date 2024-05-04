import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  content: string;
}
