import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BGG_CLIENT } from './bgg-client.token.js';
import { BggHttpClient } from './bgg-http.client.js';
import { BggModule } from './bgg.module.js';
import { MockBggClient } from './mock/mock-bgg.client.js';

describe('BggModule', () => {
  let testingModule: TestingModule | undefined;
  let previousUseMock: string | undefined;
  let previousApiToken: string | undefined;

  beforeEach(() => {
    previousUseMock = process.env['BGG_USE_MOCK'];
    previousApiToken = process.env['BGG_API_TOKEN'];
    delete process.env['BGG_USE_MOCK'];
    delete process.env['BGG_API_TOKEN'];
  });

  afterEach(async () => {
    await testingModule?.close();
    testingModule = undefined;

    if (previousUseMock === undefined) {
      delete process.env['BGG_USE_MOCK'];
    } else {
      process.env['BGG_USE_MOCK'] = previousUseMock;
    }

    if (previousApiToken === undefined) {
      delete process.env['BGG_API_TOKEN'];
    } else {
      process.env['BGG_API_TOKEN'] = previousApiToken;
    }
  });

  it('provides the mock client when BGG_USE_MOCK is enabled', async () => {
    process.env['BGG_USE_MOCK'] = '1';
    testingModule = await Test.createTestingModule({ imports: [BggModule] }).compile();

    expect(testingModule.get(BGG_CLIENT)).toBeInstanceOf(MockBggClient);
  });

  it('provides the HTTP client when a token is configured', async () => {
    process.env['BGG_API_TOKEN'] = 'test-token';
    testingModule = await Test.createTestingModule({ imports: [BggModule] }).compile();

    expect(testingModule.get(BGG_CLIENT)).toBeInstanceOf(BggHttpClient);
  });

  it('fails during module compilation when the real client has no token', async () => {
    await expect(Test.createTestingModule({ imports: [BggModule] }).compile()).rejects.toThrow(
      'BGG_API_TOKEN is not set',
    );
  });
});
