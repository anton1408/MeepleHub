import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service.js';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  getAllGames() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  getGame(@Param('id', ParseIntPipe) bggId: number) {
    return this.gamesService.findOne(bggId);
  }
}
