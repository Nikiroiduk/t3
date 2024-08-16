import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { Col } from './col.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/dto/CreateUserDto.model';
import { plainToInstance } from 'class-transformer';
import { CreateColDto } from 'src/dto/CreateColDto.model';
import { User } from 'src/users/user.model';
import { UpdateColDto } from 'src/dto/UpdateColDto.mode';

@Injectable()
export class ColsService {
    constructor(
        @InjectModel(Col)
        private colModel: typeof Col,
        @InjectModel(User) private userModel: typeof User,
    ) { }

    async create(userId: string, createColDto: CreateColDto, currentUser: any) : Promise<Col>{
        const user = await this.userModel.findByPk(userId);
        if (!user){
            throw new NotFoundException(`User with ID ${userId} not fount`);
        }
        if (userId != currentUser.userId){
            throw new ForbiddenException('You are not allower to create a column here.');
        }

        const existingColumn = await this.colModel.findOne({
            where: {name: createColDto.name, userId},
        });

        if (existingColumn){
            throw new ConflictException(`Column with name ${createColDto.name} already exists`);
        }

        const column = await this.colModel.create({...createColDto, userId});
        return column;
    }

    async findAllByUserId(userId: string): Promise<Col[]> {
        const columns = await this.colModel.findAll({
            where: {userId},
        });

        if (columns.length === 0) {
            throw new NotFoundException(`No columns found for user with ID ${userId}`);
        }

        return columns;
    }

    async update(userId: string, colId: string, updateColDto: UpdateColDto): Promise<Col> {
        const column = await this.colModel.findOne({
            where: {id: colId, userId},
        });

        if (!column){
            throw new NotFoundException(`Column with ID ${colId} not found or not associated with user ${userId}`);
        }

        const updatedColumn = await column.update(updateColDto);

        return updatedColumn;
    }

    async findOne(userId: string, colId: string): Promise<Col | null> {
        const column = await this.colModel.findOne({
            where: {id: colId, userId},
        });

        if (!column){
            throw new NotFoundException(`Column with ID ${colId} not found or not associated with user ${userId}`);
        }

        return column;
    }

    async delete(userId: string, colId: string): Promise<boolean> {
        const column = await this.colModel.findOne({
            where: {id: colId, userId},
        });

        if (!column) {
            throw new NotFoundException(`Column with ID ${colId} not found or not associated with user ${userId}`);
        }

        await column.destroy();

        return true;
    }
}