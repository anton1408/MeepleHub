import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BGG_CLIENT } from '../bgg/bgg-client.token.js';
import type { BggClient } from '../bgg/types.js';
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
    const game = await this.prisma.game.findUnique({
      where: { bggId },
    });

    if (!game) {
      throw new NotFoundException(`Game with BGG ID ${bggId} not found`);
    }

    return game;
  }

  async search(query: string) {
    return await this.bggClient.search(query);
  }
}
