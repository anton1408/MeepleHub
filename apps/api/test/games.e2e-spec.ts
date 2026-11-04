import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { expect } from 'vitest';
import { GamesController } from '../src/games/games.controller.js';
import { GamesService } from '../src/games/games.service.js';

describe('GamesController (e2e)', () => {
  let app: INestApplication<App>;

  const gamesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: gamesServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('GET /games/search returns search results and trims the query before calling the service', async () => {
    const games = [{ id: '13', name: 'Catan' }];
    const queryParams = { query: '  Catan   ' };
    gamesServiceMock.search.mockResolvedValue(games);

    await request(app.getHttpServer()).get('/games/search').query(queryParams).expect(200).expect(games);
    expect(gamesServiceMock.search).toHaveBeenCalledWith('Catan');
  });

  it('GET /games/search returns 400 when the query is an empty string', async () => {
    const queryParams = { query: '' };

    await request(app.getHttpServer()).get('/games/search').query(queryParams).expect(400);
    expect(gamesServiceMock.search).not.toHaveBeenCalled();
  });

  it('GET /games/search returns 400 when the query contains only whitespace', async () => {
    const queryParams = { query: '    ' };

    await request(app.getHttpServer()).get('/games/search').query(queryParams).expect(400);
    expect(gamesServiceMock.search).not.toHaveBeenCalled();
  });

  it('GET /games/search returns 400 when the query parameter is missing', async () => {
    const queryParams = {};

    await request(app.getHttpServer()).get('/games/search').query(queryParams).expect(400);
    expect(gamesServiceMock.search).not.toHaveBeenCalled();
  });

  afterEach(async () => {
    await app.close();
  });
});
