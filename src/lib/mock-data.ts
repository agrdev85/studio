import type { Tournament, Score, Payment } from './types';

export const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: "Cyberpunk Showdown",
    description: "A fast-paced tournament in the heart of Neo-Kyoto. High stakes, high rewards.",
    maxPlayers: 64,
    currentPlayers: 42,
    registrationFee: 10,
    startDate: new Date("2024-08-01T18:00:00Z"),
    endDate: new Date("2024-08-03T23:00:00Z"),
    isActive: true,
    prizePool: 1000,
  },
  {
    id: 2,
    name: "Aetherium Clash",
    description: "Battle in the floating islands of Aether. Precision and mobility are key.",
    maxPlayers: 32,
    currentPlayers: 15,
    registrationFee: 10,
    startDate: new Date("2024-08-10T18:00:00Z"),
    endDate: new Date("2024-08-12T23:00:00Z"),
    isActive: true,
    prizePool: 500,
  },
  {
    id: 3,
    name: "Void Runners",
    description: "A closed tournament for elite players. Registrations are closed.",
    maxPlayers: 16,
    currentPlayers: 16,
    registrationFee: 10,
    startDate: new Date("2024-07-25T18:00:00Z"),
    endDate: new Date("2024-07-27T23:00:00Z"),
    isActive: false,
    prizePool: 300,
  },
];

export const globalScores: Score[] = [
  { rank: 1, user: { id: 101, username: 'Zenith', avatarUrl: 'https://picsum.photos/40/40?random=1' }, value: 98500, mode: 'free' },
  { rank: 2, user: { id: 102, username: 'Vortex', avatarUrl: 'https://picsum.photos/40/40?random=2' }, value: 95200, mode: 'free' },
  { rank: 3, user: { id: 103, username: 'Nova', avatarUrl: 'https://picsum.photos/40/40?random=3' }, value: 94800, mode: 'free' },
  { rank: 4, user: { id: 104, username: 'Pulse', avatarUrl: 'https://picsum.photos/40/40?random=4' }, value: 91100, mode: 'free' },
  { rank: 5, user: { id: 105, username: 'Echo', avatarUrl: 'https://picsum.photos/40/40?random=5' }, value: 89600, mode: 'free' },
  { rank: 6, user: { id: 106, username: 'Rogue', avatarUrl: 'https://picsum.photos/40/40?random=6' }, value: 88400, mode: 'free' },
  { rank: 7, user: { id: 107, username: 'Cipher', avatarUrl: 'https://picsum.photos/40/40?random=7' }, value: 87550, mode: 'free' },
  { rank: 8, user: { id: 108, username: 'Blaze', avatarUrl: 'https://picsum.photos/40/40?random=8' }, value: 86300, mode: 'free' },
  { rank: 9, user: { id: 109, username: 'Specter', avatarUrl: 'https://picsum.photos/40/40?random=9' }, value: 85000, mode: 'free' },
  { rank: 10, user: { id: 110, username: 'Jinx', avatarUrl: 'https://picsum.photos/40/40?random=10' }, value: 84200, mode: 'free' },
];


export const tournamentScores: Score[] = [
    { rank: 1, user: { id: 201, username: 'CyberNinja', avatarUrl: 'https://picsum.photos/40/40?random=11' }, value: 15200, mode: 'tournament' },
    { rank: 2, user: { id: 101, username: 'Zenith', avatarUrl: 'https://picsum.photos/40/40?random=1' }, value: 14800, mode: 'tournament' },
    { rank: 3, user: { id: 202, username: 'Glitched', avatarUrl: 'https://picsum.photos/40/40?random=12' }, value: 14750, mode: 'tournament' },
    { rank: 4, user: { id: 104, username: 'Pulse', avatarUrl: 'https://picsum.photos/40/40?random=4' }, value: 13900, mode: 'tournament' },
    { rank: 5, user: { id: 203, username: 'Holo', avatarUrl: 'https://picsum.photos/40/40?random=13' }, value: 13500, mode: 'tournament' },
];

export const mockPayments: Payment[] = [
    { id: 1, userId: 102, username: 'Vortex', tournamentId: 1, txHash: '0xabc...def', amount: 10, isActive: false, createdAt: new Date() },
    { id: 2, userId: 105, username: 'Echo', tournamentId: 1, txHash: '0x123...456', amount: 10, isActive: false, createdAt: new Date() },
    { id: 3, userId: 108, username: 'Blaze', tournamentId: 2, txHash: '0x789...abc', amount: 10, isActive: true, createdAt: new Date() },
    { id: 4, userId: 109, username: 'Specter', tournamentId: 1, txHash: '0xdef...ghi', amount: 10, isActive: false, createdAt: new Date() },
];
