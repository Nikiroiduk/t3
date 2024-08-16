import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from "./card.model";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { JwtService } from "@nestjs/jwt";
import { Col } from "src/column/col.model";

@Module({
    imports: [SequelizeModule.forFeature([Card, Col])],
    controllers: [CardsController],
    providers: [CardsService, JwtService],
    exports: [SequelizeModule]
})
export class CardsModule { }