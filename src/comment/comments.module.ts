import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from "src/card/card.model";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.model";
import { Comment } from './comment.model';

@Module({
    imports: [SequelizeModule.forFeature([Comment, Card, User])],
    controllers: [CommentsController],
    providers: [CommentsService, JwtService],
    exports: [SequelizeModule]
})
export class CommentsModule { }