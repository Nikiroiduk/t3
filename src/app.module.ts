import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { Col } from './column/col.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Card } from './card/card.model';
import { Comment } from './comment/comment.model';
import { ColsModule } from './column/cols.module';
import { CardsModule } from './card/cards.module';
import { CommentsModule } from './comment/comments.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'DESKTOP-N9GLHEJ',
      port: 3306,
      username: 'T3',
      password: 'password',
      database: 't3_db',
      autoLoadModels: true,
      synchronize: true,
      models: [User, Col, Card, Comment],
    }),
    AuthModule,
    UsersModule,
    ColsModule,
    CardsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})

export class AppModule { }
