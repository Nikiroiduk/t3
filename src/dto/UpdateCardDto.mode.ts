import { IsOptional, IsString, IsIn, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
    @ApiProperty({ description: 'The name of the card', required: false })
    @IsOptional()
    @IsString()
    @Length(3, 255, { message: 'Name must be between 3 and 255 characters long' })
    name?: string;

    @ApiProperty({ description: 'The description of the card', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'The status of the card', required: false })
    @IsOptional()
    @IsString()
    @IsIn(['open', 'in-progress', 'done'], { message: 'Status must be one of: open, in-progress, done' })
    status?: string;
}