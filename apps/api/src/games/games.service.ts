import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BGG_CLIENT } from '../bgg/bgg-client.token.js';
import type { BggClient, BggGame } from '../bgg/types.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(BGG_CLIENT) private readonly bggClient: BggClient,
  ) {}

  findAll() {
    return this.prisma.game.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(bggId: number) {
    const dbGame = await this.prisma.game.findUnique({
      where: { bggId },
    });

    if (dbGame) return dbGame;

    let bggGameData: BggGame | null;
    try {
      bggGameData = await this.bggClient.getGame(String(bggId));
    } catch {
      throw new BadGatewayException('BoardGameGeek is currently unavailable');
    }
    if (!bggGameData) throw new NotFoundException(`Game with BGG ID ${bggId} not found`);

    const gameData = {
      bggId,
      name: bggGameData.name,
      description: bggGameData.description ?? null,
      yearPublished: bggGameData.yearPublished ?? null,
      image: bggGameData.image ?? null,
      thumbnail: bggGameData.thumbnail ?? null,
      minPlayers: bggGameData.minPlayers ?? null,
      maxPlayers: bggGameData.maxPlayers ?? null,
      playingTime: bggGameData.playingTime ?? null,
      averageRating: bggGameData.averageRating ?? null,
      bggSyncedAt: new Date(),
    };

    return this.prisma.game.upsert({
      where: { bggId },
      create: gameData,
      update: gameData,
    });
  }

  async search(query: string) {
    try {
      return await this.bggClient.search(query);
    } catch {
      throw new BadGatewayException('BoardGameGeek is currently unavailable');
    }
  }
}
