import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ description: 'Content of the comment' })
    @IsNotEmpty()
    @IsString()
    content: string;
}