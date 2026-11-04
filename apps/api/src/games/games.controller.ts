import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GamesService } from './games.service.js';
import { SearchGamesQueryDto } from './dto/search-games-query.dto.js';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  getAllGames() {
    return this.gamesService.findAll();
  }

  @Get('search')
  getSearch(@Query() queryDto: SearchGamesQueryDto) {
    return this.gamesService.search(queryDto.query);
  }

  @Get(':id')
  getGame(@Param('id', ParseIntPipe) bggId: number) {
    return this.gamesService.findOne(bggId);
  }
}
