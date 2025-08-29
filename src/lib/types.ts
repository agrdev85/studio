export interface User {
  id: number;
  username: string;
  email: string;
  usdtWallet: string;
  isAdmin: boolean;
  avatarUrl?: string; // For UI display
}

export interface Tournament {
  id: number;
  name: string;
  description?: string | null;
  maxPlayers?: number | null;
  currentPlayers: number;
  registrationFee: number;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive: boolean;
  prizePool: number;
}

export interface Score {
  rank: number;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  value: number;
  mode: string;
}

export interface Payment {
  id: number;
  userId: number;
  username: string;
  tournamentId: number;
  txHash: string;
  amount: number;
  isActive: boolean;
  createdAt: Date;
}
