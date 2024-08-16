import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Card } from 'src/card/card.model';
import { User } from 'src/users/user.model';

@Table
export class Comment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Card)
    @Column(DataType.INTEGER)
    cardId!: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @Column(DataType.TEXT)
    content!: string;

    @BelongsTo(() => Card)
    card!: Card;

    @BelongsTo(() => User)
    user!: User;
}