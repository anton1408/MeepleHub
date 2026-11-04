import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BGG_CLIENT } from '../bgg/bgg-client.token.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GamesService } from './games.service.js';

describe('GamesService', () => {
  let service: GamesService;

  const prismaMock = {
    game: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };
  const bggClientMock = {
    search: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: BGG_CLIENT,
          useValue: bggClientMock,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('returns all games', async () => {
    const games = [{ bggId: 13, name: 'Catan' }];
    prismaMock.game.findMany.mockResolvedValue(games);

    await expect(service.findAll()).resolves.toEqual(games);
    expect(prismaMock.game.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('returns a game by its BGG ID', async () => {
    const game = { bggId: 13, name: 'Catan' };
    prismaMock.game.findUnique.mockResolvedValue(game);

    await expect(service.findOne(13)).resolves.toEqual(game);
    expect(prismaMock.game.findUnique).toHaveBeenCalledWith({
      where: { bggId: 13 },
    });
  });

  it('throws NotFoundException when the game does not exist', async () => {
    prismaMock.game.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('returns a list of games by query', async () => {
    const query = 'Catan';
    const list = [
      {
        id: '13',
        name: 'Catan',
      },
    ];
    bggClientMock.search.mockResolvedValue(list);

    await expect(service.search(query)).resolves.toEqual(list);
    expect(bggClientMock.search).toHaveBeenCalledWith(query);
  });

  it('throws BadGatewayException when the BGG search fails', async () => {
    bggClientMock.search.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.search('Catan')).rejects.toThrow(BadGatewayException);
  });
});
