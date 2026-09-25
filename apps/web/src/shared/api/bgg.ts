import 'server-only';

import { createMockBggClient, type BggClient } from '@meeplehub/api/bgg';
// import { createBggClient } from '@meeplehub/api/bgg';

export const bgg: BggClient = createMockBggClient({ latencyMs: 200 });
// export const bgg: BggClient = createBggClient({ userAgent: 'MeepleHub/1.0' });
