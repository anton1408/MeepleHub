import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BggModule } from './bgg/bgg.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GamesController } from './games/games.controller.js';
import { GamesService } from './games/games.service.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BggModule, PrismaModule],
  controllers: [AppController, GamesController],
  providers: [AppService, GamesService],
})
export class AppModule {}
