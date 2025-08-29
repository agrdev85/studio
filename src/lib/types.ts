// These types are based on the Prisma schema

import type { Tournament as PrismaTournament, User as PrismaUser, Score as PrismaScore, Payment as PrismaPayment, TournamentRegistration } from '@prisma/client';

export interface User extends PrismaUser {
  avatarUrl?: string; // For UI display
}

export interface Tournament extends PrismaTournament {}

export interface TournamentWithRelations extends PrismaTournament {
    registrations: TournamentRegistration[];
}

export interface Score extends PrismaScore {
    user: {
        username: string;
        avatarUrl?: string;
    };
    rank?: number; // Rank is calculated and added
}

export interface Payment extends PrismaPayment {}

export interface PaymentWithUser extends PrismaPayment {
    user: {
        username: string;
    }
}
