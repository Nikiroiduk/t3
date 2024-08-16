import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/dto/CreateUserDto.model';
import { UpdateUserDto } from 'src/dto/UpdateUserDto.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({
            where: {
                id,
            },
        });
    }

    async getUserById(userId: string, currentUser: any): Promise<User> {
        const user = await this.userModel.findByPk(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (userId != currentUser.userId) {
            throw new ForbiddenException('You are not allowed to access this user information');
        }

        return user;
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({
            where: {
                email
            }
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password,
        })
        return user.save();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const updatedUser = await user.update(updateUserDto);
        return updatedUser;
    }

    async delete(id: string): Promise<boolean> {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await user.destroy();
        return true;
    }
}