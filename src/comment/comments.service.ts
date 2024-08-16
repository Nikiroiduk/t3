import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/dto/CreateUserDto.model';
import { plainToInstance } from 'class-transformer';
import { CreateColDto } from 'src/dto/CreateColDto.model';
import { Comment } from 'src/comment/comment.model';
import { UpdateColDto } from 'src/dto/UpdateColDto.mode';
import { Card } from 'src/card/card.model';
import { CreateCommentDto } from 'src/dto/CreateCommentDto.model';
import { Col } from 'src/column/col.model';
import { UpdateCommentDto } from 'src/dto/UpdateCommentDto.model';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment) private readonly commentsModel: typeof Comment,
        @InjectModel(Card) private cardsModel: typeof Card,
    ) { }

    async addComment(cardId: string, createCommentDto: CreateCommentDto, currentUser: any): Promise<Comment> {
        const card = await this.cardsModel.findByPk(cardId, {
            include: [{ model: Col, attributes: ['userId'] }],
        });

        if (!card) {
            throw new NotFoundException(`Card with ID ${cardId} not found`);
        }

        if (card.column.userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowed to add comments to this card');
        }

        const comment = await this.commentsModel.create({
            ...createCommentDto,
            cardId: card.id,
            userId: currentUser.userId,
        });

        return comment;
    }

    async updateComment(cardId: string, commentId: string, updateCommentDto: UpdateCommentDto, currentUser: any): Promise<Comment> {
        const comment = await this.commentsModel.findByPk(commentId);

        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }

        if (comment.cardId != parseInt(cardId, 10)){
            throw new ForbiddenException('The comment does not belong to the specified card');
        }

        if (comment.userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowed to update this comment')
        }

        comment.content = updateCommentDto.content;
        await comment.save();

        return comment;
    }

    async getAllCommentsForCard(cardId: string, currentUser: any): Promise<Comment[]> {
        const card = await this.cardsModel.findByPk(cardId, {
            include: [Col],
        });

        if (!card) {
            throw new NotFoundException(`Card with ID ${cardId} not found`);
        }

        if (card.column.userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowed to access comments');
        }

        return this.commentsModel.findAll({ where: { cardId } });
    }

    async deleteComment(cardId: string, commentId: string, currentUser: any): Promise<boolean> {
        const comment = await this.commentsModel.findByPk(commentId);

        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }

        if (comment.cardId != parseInt(cardId, 10)){
            throw new ForbiddenException('The comment does not belong to the specified card');
        }

        if (comment.userId != currentUser.userId){
            throw new ForbiddenException('You are not allowed to delete comments in this card');
        }

        await comment.destroy();

        return true;
    }
}