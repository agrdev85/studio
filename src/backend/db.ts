// This is a mock in-memory database.
// In a real application, you would use Prisma + PostgreSQL as defined in CUFIRE-SPEC.md.

interface User {
  id: number;
  username: string;
  email: string;
  password: string; // In a real app, this would be a hash
  usdtWallet: string;
  isAdmin: boolean;
}

interface Tournament {
  id: number;
  name: string;
  description?: string | null;
  maxPlayers?: number | null;
  currentAmount: number;
  maxAmount?: number | null;
  registrationFee: number;
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: number | null; // minutes
  isActive: boolean;
  createdAt: Date;
}

const users: User[] = [
    { id: 1, username: 'admin', email: 'admin@cufire.com', password: 'password', usdtWallet: 'TADMINWALLET001', isAdmin: true },
];

const tournaments: Tournament[] = [];

let nextUserId = 2;

export const db = {
  users: {
    findUnique: async (query: { where: { username?: string; email?: string; usdtWallet?: string; } }) => {
      return users.find(u => 
        (query.where.username && u.username === query.where.username) ||
        (query.where.email && u.email === query.where.email) ||
        (query.where.usdtWallet && u.usdtWallet === query.where.usdtWallet)
      );
    },
    create: async (query: { data: Omit<User, 'id' | 'isAdmin'> }) => {
      const newUser: User = {
        id: nextUserId++,
        ...query.data,
        isAdmin: false,
      };
      users.push(newUser);
      return newUser;
    },
    findFirst: async (query: { where: { username: string; password?: string; } }) => {
        return users.find(u => u.username === query.where.username && u.password === query.where.password);
    }
  },
  // Add other models (tournaments, scores, etc.) here as needed.
};
