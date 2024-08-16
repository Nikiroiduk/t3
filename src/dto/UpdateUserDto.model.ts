import { IsString, IsEmail, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email', required: false })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User password', required: false })
  @IsString()
  @Length(6, 255, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'User username', required: false })
  @IsString()
  @Length(3, 255, { message: 'Username must be between 3 and 255 characters long' })
  @IsOptional()
  username?: string;
}