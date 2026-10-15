import 'server-only';

import { createMockBggClient, createBggClient, type BggClient } from '@meeplehub/bgg-client/bgg';

const useMock = process.env.BGG_USE_MOCK === '1';

export const bgg: BggClient = useMock
  ? createMockBggClient({ latencyMs: 200 })
  : createBggClient({
      userAgent: 'MeepleHub/1.0',
      apiToken: process.env.BGG_API_TOKEN,
    });
