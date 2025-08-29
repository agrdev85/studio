// This file will contain all the functions to interact with our backend API.
import type { TournamentWithRelations, Score, PaymentWithUser } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002/api';

async function fetcher(url: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    // Add token if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cufire_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        const error = new Error(errorData.message || 'An error occurred while fetching the data.');
        // @ts-ignore
        error.status = res.status;
        throw error;
    }

    // Handle no content response
    if (res.status === 204) {
        return null;
    }

    return res.json();
}

// Tournament Functions
export const getTournaments = (): Promise<TournamentWithRelations[]> => fetcher('/tournaments');
export const getAllTournamentsAdmin = (): Promise<TournamentWithRelations[]> => fetcher('/tournaments/all');
export const getTournamentById = (id: number): Promise<TournamentWithRelations> => fetcher(`/tournaments/${id}`);
export const createTournament = (data: any) => fetcher('/tournaments', { method: 'POST', body: JSON.stringify(data) });
export const deleteTournament = (id: number) => fetcher(`/tournaments/${id}`, { method: 'DELETE' });


// Score Functions
export const getGlobalScores = (): Promise<Score[]> => fetcher('/scores/global');
export const getTournamentScores = (tournamentId: number): Promise<Score[]> => fetcher(`/scores/tournament/${tournamentId}`);

// Payment Functions
export const getPendingPayments = (): Promise<PaymentWithUser[]> => fetcher('/payments/pending');
export const verifyPayment = (paymentId: number): Promise<{ message: string }> => fetcher(`/payments/${paymentId}/verify`, { method: 'PUT' });
export const joinTournament = (tournamentId: number, txHash: string): Promise<{ message: string }> => fetcher(`/tournaments/${tournamentId}/join`, {
    method: 'POST',
    body: JSON.stringify({ txHash }),
});

// User Functions
export const getAllUsersAdmin = (): Promise<any[]> => fetcher('/users');
