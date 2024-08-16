import { Table, Column, Model, BelongsTo, ForeignKey, HasMany, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { Col } from 'src/column/col.model';
import { Comment } from '../comment/comment.model';

@Table
export class Card extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Col)
    @Column(DataType.INTEGER)
    columnId!: number;

    @Column(DataType.STRING(255))
    name!: string;

    @Column(DataType.TEXT)
    description: string;

    @Column(DataType.STRING(255))
    status!: string;

    @BelongsTo(() => Col)
    column!: Col;

    @HasMany(() => Comment)
    comments!: Comment[];
}