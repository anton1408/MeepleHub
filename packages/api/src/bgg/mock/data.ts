import type { BggGame } from '../types';

/**
 * Static fixture games for the mock BGG client.
 *
 * Used first, before the real BGG integration lands. Keyed by BGG id so the
 * mock client can resolve `getGame` in O(1).
 */
export const MOCK_GAMES: Record<string, BggGame> = {
  '13': {
    id: '13',
    name: 'Catan',
    description: 'Trade, build and settle the island of Catan in this classic game of resource management.',
    yearPublished: 1995,
    image: 'https://cf.geekdo-images.com/catan.jpg',
    thumbnail: 'https://cf.geekdo-images.com/catan_thumb.jpg',
    minPlayers: 3,
    maxPlayers: 4,
    playingTime: 90,
    averageRating: 7.1,
  },
  '9209': {
    id: '9209',
    name: 'Ticket to Ride',
    description: 'Collect train cards and claim railway routes across the map.',
    yearPublished: 2004,
    image: 'https://cf.geekdo-images.com/ttr.jpg',
    thumbnail: 'https://cf.geekdo-images.com/ttr_thumb.jpg',
    minPlayers: 2,
    maxPlayers: 5,
    playingTime: 60,
    averageRating: 7.4,
  },
  '30549': {
    id: '30549',
    name: 'Pandemic',
    description: 'Work together as a team to treat infections and find cures for four diseases.',
    yearPublished: 2008,
    image: 'https://cf.geekdo-images.com/pandemic.jpg',
    thumbnail: 'https://cf.geekdo-images.com/pandemic_thumb.jpg',
    minPlayers: 2,
    maxPlayers: 4,
    playingTime: 45,
    averageRating: 7.6,
  },
  '167791': {
    id: '167791',
    name: 'Terraforming Mars',
    description: 'Compete to transform Mars into a habitable planet by raising temperature, oxygen and ocean coverage.',
    yearPublished: 2016,
    image: 'https://cf.geekdo-images.com/tm.jpg',
    thumbnail: 'https://cf.geekdo-images.com/tm_thumb.jpg',
    minPlayers: 1,
    maxPlayers: 5,
    playingTime: 120,
    averageRating: 8.4,
  },
};
