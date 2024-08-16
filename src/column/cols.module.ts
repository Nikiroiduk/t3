import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Col } from './col.model';
import { ColsController } from './cols.controller';
import { ColsService } from './cols.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.model';

@Module({
    imports: [SequelizeModule.forFeature([Col, User])],
    controllers: [ColsController],
    providers: [ColsService, JwtService],
    exports: [SequelizeModule]
})
export class ColsModule { }