import { Controller, Get, Request, UseGuards, Post, Param, Body, UsePipes, Query, ForbiddenException, NotFoundException, Put, ValidationPipe, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/CreateUserDto.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/dto/UpdateUserDto.model';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'User is loaded' })
    @ApiBearerAuth()
    async findOne(
        @Param('id') id: string,
        @Request() req: any): Promise<User> {
        return this.usersService.getUserById(id, req.user);
    }

    @Post()
    @ApiOperation({ summary: 'New user registration' })
    @ApiBody({ type: CreateUserDto })
    @ApiQuery({ name: 'email', required: true, description: 'Valid email adress', type: String })
    @ApiQuery({ name: 'username', required: true, description: 'Username must be betwee 3 and 255 characters long', type: String })
    @ApiQuery({ name: 'password', required: true, description: 'Password must be at least 6 characters long', type: String })
    @ApiResponse({ status: 201, description: 'User has been created successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 409, description: 'User with this username or email already exists' })
    async register(
        @Query('email') email: string,
        @Query('username') username: string,
        @Query('password') password: string
    ) {
        const createUserDto: CreateUserDto = { email, password, username };
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update user information' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User information succesfully updated' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update user information' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBearerAuth()
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: any,
    ) {
        console.log('req user userId ', req.user.userId);
        console.log('id ', id);
        if (req.user.userId != id) {
            throw new ForbiddenException('You are not allowed to update user information');
        }

        const updatedUser = await this.usersService.update(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return updatedUser;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 204, description: 'User succesfully deleted' })
    @ApiResponse({ status: 403, description: 'You are not allowed to delete user' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBearerAuth()
    async delete(
        @Param('id') id: string,
        @Request() req: any
    ) {
        console.log('req id ', req.user.userId);
        console.log('id ', id);
        if (req.user.userId != id) {
            throw new ForbiddenException('You are not allowed to delete this user');
        }

        const result = await this.usersService.delete(id);
        // TODO: blacklist user jwt

        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return { status: 204, message: 'User successfully deleted' };
    }
}