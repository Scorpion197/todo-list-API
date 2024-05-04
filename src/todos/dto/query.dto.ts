import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class TodoQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Cursor for pagination' })
  cursor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter todos by content' })
  content?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ description: 'Sort order for createdAt' })
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsIn(['content', 'createdAt'])
  @ApiPropertyOptional({ description: 'Sort by field' })
  sortBy?: 'content' | 'createdAt';
}
