import { Router, Response } from 'express';
import prisma from '../prisma';
import { protect, admin, AuthRequest } from '../authMiddleware';

const router = Router();

// GET /api/users/me - Get current logged in user
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
                usdtWallet: true,
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/users - Admin gets all users
router.get('/', protect, admin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                usdtWallet: true,
                isAdmin: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
         res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
