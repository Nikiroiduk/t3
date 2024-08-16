import { Table, Column, Model, HasMany, AllowNull, BeforeSave, PrimaryKey, Unique, DataType, AutoIncrement } from 'sequelize-typescript';
import { Col } from '../column/col.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Card } from 'src/card/card.model';
import { Comment } from 'src/comment/comment.model';
import { IsEmail, IsInt, IsString, Length } from 'class-validator';


@Table
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
    
    @ApiProperty({description: 'User name'})
    @Unique
    @Column(DataType.STRING(255))
    username!: string;

    @Exclude()
    @Column(DataType.STRING(255))
    password!: string;

    @ApiProperty({description: 'User email'})
    @Column(DataType.STRING(255))
    email!: string;

    @ApiProperty({description: 'User columns'})
    @HasMany(() => Col)
    columns!: Col[];

    @ApiProperty({description: 'User comments'})
    @HasMany(() => Comment)
    comments!: Comment[];

    @BeforeSave
    static async hashPassword(instance: User){
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
        }
    }
}