import { Module } from '@nestjs/common';
import { createBggClient } from './bgg-http.client.js';
import { BGG_CLIENT } from './bgg-client.token.js';
import { createMockBggClient } from './mock/mock-bgg.client.js';
import type { BggClient } from './types.js';

const bggClientProvider = {
  provide: BGG_CLIENT,
  useFactory: (): BggClient => {
    if (process.env['BGG_USE_MOCK'] === '1') {
      return createMockBggClient();
    }

    const apiToken = process.env['BGG_API_TOKEN'];
    if (!apiToken) {
      throw new Error('BGG_API_TOKEN is not set');
    }

    return createBggClient({
      userAgent: 'MeepleHub/1.0',
      apiToken,
    });
  },
};

@Module({
  providers: [bggClientProvider],
  exports: [BGG_CLIENT],
})
export class BggModule {}
