import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/scores/global
// Corresponds to Unity's `readscore` URL for the global leaderboard
router.get('/global', async (req: Request, res: Response) => {
    try {
        const scores = await prisma.score.findMany({
            where: { mode: 'free' },
            orderBy: { value: 'desc' },
            take: 10,
            include: {
                user: {
                    select: { username: true }
                }
            }
        });

        // Format for Unity client as per web.cs
        const unityFormatted = scores.map(s => `username:${s.user.username}|Puntos:${s.value}`).join(';');
        
        // Also respond with JSON for web client
        res.format({
            'text/plain': () => {
                res.send(unityFormatted);
            },
            'application/json': () => {
                const webFormatted = scores.map((s, index) => ({
                    rank: index + 1,
                    user: {
                        username: s.user.username
                    },
                    value: s.value,
                    mode: s.mode,
                }))
                res.json(webFormatted);
            },
            default: () => {
                res.status(406).send('Not Acceptable');
            }
        })

    } catch (error) {
        console.error("Error fetching global scores:", error);
        res.status(500).send("error: Internal server error");
    }
});

// GET /api/scores/tournament/:id
router.get('/tournament/:id', async (req: Request, res: Response) => {
    const tournamentId = parseInt(req.params.id, 10);
    if (isNaN(tournamentId)) {
        return res.status(400).json({ message: 'Invalid tournament ID' });
    }

    try {
        const scores = await prisma.score.findMany({
            where: { tournamentId: tournamentId },
            orderBy: { value: 'desc' },
            take: 10,
            include: {
                user: { select: { username: true, id: true, usdtWallet: true } }
            }
        });

        const rankedScores = scores.map((s, index) => ({
            rank: index + 1,
            ...s
        }));

        res.json(rankedScores);
    } catch (error) {
        console.error(`Error fetching scores for tournament ${tournamentId}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /api/scores/submit
// Corresponds to Unity's `writescore` URL
router.post('/submit', async (req: Request, res: Response) => {
    const { name, puntos } = req.body; // from Unity
    const { username, score } = req.body; // from potential web submissions

    const finalUsername = name || username;
    const finalScore = parseInt(puntos || score, 10);

    if (!finalUsername || isNaN(finalScore)) {
        return res.status(400).send('error: Missing name or score');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username: finalUsername }
        });

        if (!user) {
            return res.status(404).send('error: User not found');
        }

        // Check if user is in an active tournament
        const registration = await prisma.tournamentRegistration.findFirst({
            where: {
                userId: user.id,
                tournament: {
                    isActive: true
                }
            },
            include: {
                tournament: true
            }
        });

        let mode = 'free';
        let tournamentId = null;

        // More robust logic to determine if score belongs to tournament
        if (registration) {
            const payment = await prisma.payment.findFirst({
                where: {
                    userId: user.id,
                    tournamentId: registration.tournamentId,
                    isActive: true,
                }
            });
            // Score only counts for tournament if payment is verified and tournament is running
            if (payment && registration.tournament.startDate && new Date(registration.tournament.startDate) <= new Date() && (!registration.tournament.endDate || new Date(registration.tournament.endDate) > new Date())) {
                mode = 'tournament';
                tournamentId = registration.tournamentId;
            }
        }

        await prisma.score.create({
            data: {
                userId: user.id,
                value: finalScore,
                mode: mode,
                tournamentId: tournamentId
            }
        });

        res.status(201).send('ok');

    } catch (error) {
        console.error("Error submitting score:", error);
        res.status(500).send('error: Internal server error');
    }
});

export default router;
