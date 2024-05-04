import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
