import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

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
}
