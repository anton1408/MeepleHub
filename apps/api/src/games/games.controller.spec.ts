import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GamesService } from './games.service.js';
import { GamesController } from './games.controller.js';

describe('GamesController', () => {
  let controller: GamesController;

  const gamesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: gamesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('returns all games from the service', async () => {
    const games = [{ bggId: 13, name: 'Catan' }];
    gamesServiceMock.findAll.mockResolvedValue(games);

    await expect(controller.getAllGames()).resolves.toEqual(games);
    expect(gamesServiceMock.findAll).toHaveBeenCalledOnce();
  });

  it('returns a list of games matching the search query', async () => {
    const games = [{ id: '13', name: 'Catan' }];
    const queryParams = { query: 'Catan' };
    gamesServiceMock.search.mockResolvedValue(games);

    await expect(controller.getSearch(queryParams)).resolves.toEqual(games);
    expect(gamesServiceMock.search).toHaveBeenCalledWith(queryParams.query);
  });

  it('returns a game by its BGG ID from the service', async () => {
    const game = { bggId: 13, name: 'Catan' };
    gamesServiceMock.findOne.mockResolvedValue(game);

    await expect(controller.getGame(13)).resolves.toEqual(game);
    expect(gamesServiceMock.findOne).toHaveBeenCalledWith(13);
  });
});
