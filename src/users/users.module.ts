import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [SequelizeModule.forFeature([User]), UsersModule],
    controllers: [UsersController],
    providers: [UsersService, JwtService],
    exports: [SequelizeModule, UsersService],
})
export class UsersModule { }