import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GamesService } from './games.service.js';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  getAllGames() {
    return this.gamesService.findAll();
  }

  @Get('search')
  getSearch(@Query('query') query: string | undefined) {
    const trimmedQuery = query?.trim();

    if (!trimmedQuery) {
      throw new BadRequestException('Query parameter "query" is required');
    }

    return this.gamesService.search(trimmedQuery);
  }

  @Get(':id')
  getGame(@Param('id', ParseIntPipe) bggId: number) {
    return this.gamesService.findOne(bggId);
  }
}
