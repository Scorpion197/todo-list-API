import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Minimum todo content is 6 characters' })
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
