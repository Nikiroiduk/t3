import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { Card } from 'src/card/card.model';
import { User } from 'src/users/user.model';

@Table
export class Col extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @Column(DataType.STRING(255))
    name!: string;

    @BelongsTo(() => User)
    user!: User;

    @HasMany(() => Card)
    cards!: Card[];
}