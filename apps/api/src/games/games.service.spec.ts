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
      upsert: vi.fn(),
    },
  };
  const bggClientMock = {
    search: vi.fn(),
    getGame: vi.fn(),
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

  // findAll
  it('returns all games', async () => {
    const games = [{ bggId: 13, name: 'Catan' }];
    prismaMock.game.findMany.mockResolvedValue(games);

    await expect(service.findAll()).resolves.toEqual(games);
    expect(prismaMock.game.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  // findOne
  it('returns a game by its BGG ID', async () => {
    const game = { bggId: 13, name: 'Catan' };
    prismaMock.game.findUnique.mockResolvedValue(game);

    await expect(service.findOne(13)).resolves.toEqual(game);
    expect(prismaMock.game.findUnique).toHaveBeenCalledWith({
      where: { bggId: 13 },
    });
    expect(bggClientMock.getGame).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when BGG does not contain the requested game', async () => {
    prismaMock.game.findUnique.mockResolvedValueOnce(null);
    bggClientMock.getGame.mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

    expect(bggClientMock.getGame).toHaveBeenCalledWith('999');
    expect(prismaMock.game.upsert).not.toHaveBeenCalled();
  });

  it('fetches and stores a game from BGG when it is not in the database', async () => {
    const bggGame = {
      id: '13',
      name: 'Catan',
      description: 'description for test',
      yearPublished: 1995,
      image: 'https://cf.geekdo-images.com/catan.jpg',
      thumbnail: 'https://cf.geekdo-images.com/catan_thumb.jpg',
      minPlayers: 3,
      maxPlayers: 4,
      playingTime: 90,
      averageRating: 7.1,
    };
    const persistedGame = {
      bggId: 13,
      name: 'Catan',
      description: 'description for test',
      yearPublished: 1995,
      image: 'https://cf.geekdo-images.com/catan.jpg',
      thumbnail: 'https://cf.geekdo-images.com/catan_thumb.jpg',
      minPlayers: 3,
      maxPlayers: 4,
      playingTime: 90,
      averageRating: 7.1,
    };

    prismaMock.game.findUnique.mockResolvedValueOnce(null);
    bggClientMock.getGame.mockResolvedValueOnce(bggGame);
    prismaMock.game.upsert.mockResolvedValueOnce(persistedGame);

    await expect(service.findOne(13)).resolves.toEqual(persistedGame);

    expect(bggClientMock.getGame).toHaveBeenCalledWith('13');
    expect(prismaMock.game.upsert).toHaveBeenCalledWith({
      where: { bggId: 13 },
      create: expect.objectContaining({
        bggId: persistedGame.bggId,
        name: persistedGame.name,
        description: persistedGame.description,
        yearPublished: persistedGame.yearPublished,
        image: persistedGame.image,
        thumbnail: persistedGame.thumbnail,
        bggSyncedAt: expect.any(Date),
        minPlayers: persistedGame.minPlayers,
        maxPlayers: persistedGame.maxPlayers,
        playingTime: persistedGame.playingTime,
        averageRating: persistedGame.averageRating,
      }),
      update: expect.objectContaining({
        bggId: persistedGame.bggId,
        name: persistedGame.name,
        description: persistedGame.description,
        yearPublished: persistedGame.yearPublished,
        image: persistedGame.image,
        thumbnail: persistedGame.thumbnail,
        bggSyncedAt: expect.any(Date),
        minPlayers: persistedGame.minPlayers,
        maxPlayers: persistedGame.maxPlayers,
        playingTime: persistedGame.playingTime,
        averageRating: persistedGame.averageRating,
      }),
    });
  });

  // search
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

  it('throws BadGatewayException when fetching a game from BGG fails', async () => {
    prismaMock.game.findUnique.mockResolvedValueOnce(null);
    bggClientMock.getGame.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.findOne(13)).rejects.toThrow(BadGatewayException);
  });
});
