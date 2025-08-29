import { Router, Response } from 'express';
import prisma from '../prisma';
import { protect, admin, AuthRequest } from '../authMiddleware';

const router = Router();

// GET /api/tournaments - Get all tournaments
router.get('/', async (req, res: Response) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            where: { isActive: true }, // Only show active ones on the main page
            include: {
                registrations: true, // To get current player count
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tournaments);
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/tournaments/all - Admin get all tournaments (active and inactive)
router.get('/all', protect, admin, async (req, res: Response) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            include: {
                registrations: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tournaments);
    } catch (error) {
        console.error("Error fetching all tournaments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// GET /api/tournaments/:id - Get a single tournament by ID
router.get('/:id', async (req, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid tournament ID' });
    }
    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id },
            include: {
                registrations: true
            }
        });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.json(tournament);
    } catch (error) {
        console.error(`Error fetching tournament ${id}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/tournaments - Admin creates a new tournament
router.post('/', protect, admin, async (req: AuthRequest, res: Response) => {
    const { name, description, maxPlayers, maxAmount, registrationFee, duration } = req.body;
    try {
        const newTournament = await prisma.tournament.create({
            data: {
                name,
                description,
                maxPlayers: maxPlayers ? parseInt(maxPlayers) : null,
                maxAmount: maxAmount ? parseFloat(maxAmount) : null,
                registrationFee: registrationFee ? parseFloat(registrationFee) : 10.0,
                duration: duration ? parseInt(duration) : null,
                isActive: true,
                currentAmount: 0,
            }
        });
        res.status(201).json(newTournament);
    } catch (error) {
        console.error("Error creating tournament:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/tournaments/:id/join - User joins a tournament
router.post('/:id/join', protect, async (req: AuthRequest, res: Response) => {
    const tournamentId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    const { txHash } = req.body;

    if (isNaN(tournamentId) || !userId || !txHash) {
        return res.status(400).json({ message: 'Missing required data' });
    }

    try {
        const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (!tournament || !tournament.isActive) {
            return res.status(400).json({ message: 'Tournament is not active or does not exist' });
        }
        if (tournament.maxPlayers && tournament.currentAmount >= tournament.maxAmount) {
             return res.status(400).json({ message: 'Tournament registration is closed (full)' });
        }

        const existingRegistration = await prisma.tournamentRegistration.findFirst({
            where: {
                userId: userId,
                tournament: {
                    isActive: true
                }
            }
        });
        if (existingRegistration) {
            return res.status(400).json({ message: 'User is already registered in an active tournament' });
        }

        // Create the registration and a pending payment
        await prisma.$transaction(async (tx) => {
            await tx.tournamentRegistration.create({
                data: {
                    userId: userId,
                    tournamentId: tournamentId,
                }
            });
            await tx.payment.create({
                data: {
                    userId: userId,
                    tournamentId: tournamentId,
                    txHash: txHash,
                    amount: tournament.registrationFee,
                    isActive: false, // Pending verification
                }
            });
        });
        
        res.status(201).json({ message: 'Registration submitted successfully. Awaiting payment verification.' });

    } catch (error) {
        console.error("Error joining tournament:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// DELETE /api/tournaments/:id - Admin deletes a tournament
router.delete('/:id', protect, admin, async (req: AuthRequest, res: Response) => {
    const tournamentId = parseInt(req.params.id, 10);
    if(isNaN(tournamentId)) {
        return res.status(400).json({message: "Invalid tournament ID"});
    }
    try {
        // Prisma's onDelete: Cascade on the schema handles related deletions
        await prisma.tournament.delete({
            where: { id: tournamentId }
        });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error(`Error deleting tournament ${tournamentId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
})


export default router;
