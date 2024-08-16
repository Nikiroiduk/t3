import { Controller, Get, Request, UseGuards, Post, Param, Body, UsePipes, Query, Req, Headers, ForbiddenException, NotFoundException, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateColDto } from 'src/dto/CreateColDto.model';
import { UpdateColDto } from 'src/dto/UpdateColDto.mode';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from 'src/dto/CreateCommentDto.model';
import { UpdateCommentDto } from 'src/dto/UpdateCommentDto.model';


@ApiTags('Comments')
@Controller('cards')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/:cardId/comments')
    @ApiOperation({ summary: 'Adding new comment to a card' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 201, description: 'Comment has been created successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to add a comment to this card' })
    @ApiResponse({ status: 404, description: 'Card not found' })
    @ApiBearerAuth()
    async create(
        @Param('cardId') cardId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.addComment(cardId, createCommentDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:cardId/comments/:commentId')
    @ApiOperation({ summary: 'Update a comment' })
    @ApiBody({ type: UpdateCommentDto })
    @ApiResponse({ status: 200, description: 'Comment has been updated successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this comment' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @ApiBearerAuth()
    async update(
        @Param('cardId') cardId: string,
        @Param('commentId') commentId: string,
        @Body() UpdateCommentDto: UpdateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.updateComment(cardId, commentId, UpdateCommentDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:cardId/comments')
    @ApiOperation({ summary: 'Get all comment for a card' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to access comments for this card' })
    @ApiResponse({ status: 404, description: 'Card not found' })
    @ApiBearerAuth()
    async getAllCommentsForCard(
        @Param('cardId') cardId: string,
        @Request() req: any,
    ) {
        return this.commentsService.getAllCommentsForCard(cardId, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:cardId/comments/:commentId')
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 204, description: 'Comment has been deleted successfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to delete this comment' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @ApiBearerAuth()
    async delete(
        @Param('cardId') cardId: string,
        @Param('commentId') commentId: string,
        @Request() req: any,
    ) {
        const result = this.commentsService.deleteComment(cardId, commentId, req.user);
        if (!result) {
            throw new NotFoundException(`Comment with ID ${commentId} not found or not associated with card ${cardId}`);
        }
        return {status: 204, message: 'Comment was successfullt deleted'};
    }
}