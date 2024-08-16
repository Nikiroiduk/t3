import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateColDto {
  @ApiProperty({ description: 'Name of the column', example: 'New Column Name' })
  @IsString()
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters long' })
  name: string;
}