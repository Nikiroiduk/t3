import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;
    @ApiProperty()
    @IsString()
    @Length(6, 255, { message: 'Password must be at least 6 characters long' })
    password: string;
    @ApiProperty()
    @IsString()
    @Length(3, 255, { message: 'Username must be between 3 and 255 characters long' })
    username: string;
}