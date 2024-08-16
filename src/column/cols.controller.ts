import { Controller, Get, Request, UseGuards, Post, Param, Body, UsePipes, Query, Req, Headers, ForbiddenException, NotFoundException, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ColsService } from './cols.service';
import { CreateColDto } from 'src/dto/CreateColDto.model';
import { UpdateColDto } from 'src/dto/UpdateColDto.mode';


@ApiTags('Columns')
@Controller('users')
export class ColsController {
    constructor(private readonly colsService: ColsService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/columns')
    @ApiOperation({ summary: 'Creating new column' })
    @ApiBody({ type: CreateColDto })
    @ApiQuery({ name: 'name', required: true, description: 'Name must be betwee 3 and 255 characters long', type: String })
    @ApiResponse({ status: 201, description: 'Column has been created successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to create a column here' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Column with this name already exists' })
    @ApiBearerAuth()
    async register(
        @Param('id') userId: string,
        @Query('name') name: string,
        @Request() req: any,
    ) {
        const createColDto: CreateColDto = { name };
        return this.colsService.create(userId, createColDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/columns')
    @ApiOperation({ summary: 'Get list of columns for a user' })
    @ApiResponse({ status: 200, description: 'List of columns successfullty loaded' })
    @ApiResponse({ status: 403, description: 'You are not allowed to view columns' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBearerAuth()
    async getColumns(
        @Param('id') userId: string,
        @Request() req: any,
    ) {
        if (req.user.userId != userId) {
            throw new ForbiddenException('You are not allowed to view columns')
        }

        const columns = await this.colsService.findAllByUserId(userId);
        if (!columns) {
            throw new NotFoundException(`No columns found for user with ID ${userId}`)
        }

        return columns;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/columns/:colId')
    @ApiOperation({ summary: 'Update existing column' })
    @ApiBody({ type: UpdateColDto })
    @ApiResponse({ status: 200, description: 'Column updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this column' })
    @ApiResponse({ status: 404, description: 'Column or user not found' })
    @ApiBearerAuth()
    async updateColumn(
        @Param('id') userId: string,
        @Param('colId') colId: string,
        @Body() updateColDto: UpdateColDto,
        @Request() req: any,
    ) {
        if (req.user.userId != userId) {
            throw new ForbiddenException('You are not allowed to update current column');
        }

        const updatedColumn = await this.colsService.update(userId, colId, updateColDto);

        if (!updatedColumn) {
            throw new NotFoundException(`Column with ID ${colId} not found or not associated with user ${userId}`);
        }

        return updatedColumn;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/columns/:colId')
    @ApiOperation({ summary: 'Get a scecific column by ID' })
    @ApiResponse({ status: 200, description: 'Column retrieved succesfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to view this column' })
    @ApiResponse({ status: 404, description: 'Column or user not found' })
    @ApiBearerAuth()
    async getColumn(
        @Param('id') userId: string,
        @Param('colId') colId: string,
        @Request() req: any,
    ) {
        if (req.user.userId != userId) {
            throw new ForbiddenException('You are not allowed to view columns for this user');
        }

        const column = await this.colsService.findOne(userId, colId);

        if (!column) {
            throw new NotFoundException(`Column with ID`)
        }

        return column;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/columns/:colId')
    @ApiOperation({ summary: 'Delete a specific column' })
    @ApiResponse({ status: 204, description: 'Column deleted successfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to delete this column' })
    @ApiResponse({ status: 404, description: 'Column or user not found' })
    @ApiBearerAuth()
    async deleteColumn(
        @Param('id') userId: string,
        @Param('colId') colId: string,
        @Request() req: any,
    ) {
        if (req.user.userId != userId) {
            throw new ForbiddenException('You are not allowed to delete column');
        }

        const result = await this.colsService.delete(userId, colId);

        if (!result) {
            throw new NotFoundException(`Column with ID ${colId} not found or not associated with user ${userId}`);
        }

        return { status: 204, message: `Column with ID ${colId} deleted successfully` };
    }
}