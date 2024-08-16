import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateCardDto {
    @ApiProperty({ description: 'Name of the card' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Description of the card', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Status of the card' })
    @IsString()
    @IsNotEmpty()
    @IsIn(['open', 'in-progress', 'done'], { message: 'Status must be one of: open, in-progress, done' })
    status: string;
}