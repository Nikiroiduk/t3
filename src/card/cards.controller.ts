import { Controller, Get, Request, UseGuards, Post, Param, Body, UsePipes, Query, Req, Headers, ForbiddenException, NotFoundException, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from 'src/dto/CreateCardDto.model';
import { UpdateCardDto } from 'src/dto/UpdateCardDto.mode';


@ApiTags('Cards')
@Controller('columns')
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':columnId/cards')
    @ApiOperation({ summary: 'Create a new card' })
    @ApiBody({ type: CreateCardDto })
    @ApiResponse({ status: 201, description: 'Card has been created successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to create a card in this column' })
    @ApiResponse({ status: 404, description: 'Column not found' })
    @ApiBearerAuth()
    async create(
        @Param('columnId') columnId: string,
        @Body() createCardDto: CreateCardDto,
        @Request() req: any,
    ) {
        return this.cardsService.create(columnId, createCardDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':columnId/cards')
    @ApiOperation({ summary: 'Get all cards in a column' })
    @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to access cards in this column' })
    @ApiResponse({ status: 404, description: 'Column not found' })
    @ApiBearerAuth()
    async getCards(
        @Param('columnId') columnId: string,
        @Request() req: any,
    ) {
        return this.cardsService.findAllByColumn(columnId, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':columnId/cards/:cardId')
    @ApiOperation({ summary: 'Update a card' })
    @ApiBody({ type: UpdateCardDto })
    @ApiResponse({ status: 200, description: 'Card has been updated successfully' })
    @ApiResponse({ status: 400, description: 'The request data is invalid' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this card' })
    @ApiResponse({ status: 404, description: 'Card or Column not found' })
    @ApiBearerAuth()
    async update(
        @Param('columnId') columnId: string,
        @Param('cardId') cardId: string,
        @Body() updateCardDto: UpdateCardDto,
        @Request() req: any,
    ) {
        return this.cardsService.update(columnId, cardId, updateCardDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':columnId/cards/:cardId')
    @ApiOperation({ summary: 'Delete a card' })
    @ApiResponse({ status: 204, description: 'Card has been deleted successfully' })
    @ApiResponse({ status: 403, description: 'You are not allowed to delete this card' })
    @ApiResponse({ status: 404, description: 'Card or Column not found' })
    @ApiBearerAuth()
    async delete(
        @Param('columnId') columnId: string,
        @Param('cardId') cardId: string,
        @Request() req: any,
    ) {
        const result = this.cardsService.delete(columnId, cardId, req.user);

        if (!result) {
            throw new NotFoundException(`Card with ID ${cardId} not found or not associated with column ${columnId}`);
        }

        return { status: 204, message: 'Card was successfully deleted' };
    }

}