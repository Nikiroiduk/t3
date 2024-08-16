import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { Col } from 'src/column/col.model';
import { UpdateCardDto } from 'src/dto/UpdateCardDto.mode';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card) private cardModel: typeof Card,
        @InjectModel(Col) private colModel: typeof Col,
    ) { }

    async create(columnId: string, createCardDto, currentUser: any): Promise<Card> {
        const column = await this.colModel.findByPk(columnId);

        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        if (column.userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowed to create a card in this column');
        }

        const card = await this.cardModel.create({
            ...createCardDto,
            columnId,
        });

        return card;
    }

    async findAllByColumn(columnId: string, currentUser: any): Promise<Card[]> {
        const column = await this.colModel.findByPk(columnId);

        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        if (column.userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowe to access cards of this column');
        }

        const cards = await this.cardModel.findAll({
            where: { columnId },
        });

        return cards;
    }

    async update(columnId: string, cardId: string, updateCardDto: UpdateCardDto, currentUser: any): Promise<Card>{
        const card = await this.cardModel.findOne({
            where: {id: cardId, columnId},
            include: [Col],
        });

        if (!card) {
            throw new NotFoundException(`Card with ID ${cardId} not found in column ${columnId}`);
        }

        if (card.column.userId != currentUser.userId){
            throw new ForbiddenException('You are not allowed to update cards in this column');
        }

        await card.update(updateCardDto);

        return card;
    }

    async delete(columnId: string, cardId: string, currentUser: any): Promise<boolean> {
        const column = await this.colModel.findByPk(columnId);

        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        if (column.userId != currentUser.userId){
            throw new ForbiddenException('You are not allowed to delete card in this column');
        }

        const card = await this.cardModel.findOne({
            where: {id: cardId, columnId},
        });

        if (!card){
            throw new NotFoundException(`Card with ID ${cardId} not found`);
        }

        const deleted = await this.cardModel.destroy({where: {id: cardId, columnId}});
        return deleted > 0;
    }
}