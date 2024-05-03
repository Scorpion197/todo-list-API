import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Minimum todo content is 6 characters' })
  content: string;
}
