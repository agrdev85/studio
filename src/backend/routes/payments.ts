import { Router, Response } from 'express';
import { protect, admin, AuthRequest } from '../authMiddleware';
import prisma from '../prisma';

const router = Router();

// GET /api/payments/pending - Admin gets all pending payments
router.get('/pending', protect, admin, async (req: AuthRequest, res: Response) => {
    try {
        const pendingPayments = await prisma.payment.findMany({
            where: { isActive: false },
            include: {
                user: {
                    select: { username: true }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        res.json(pendingPayments);
    } catch (error) {
        console.error("Error fetching pending payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// PUT /api/payments/:id/verify - Admin verifies a payment
router.put('/:id/verify', protect, admin, async (req: AuthRequest, res: Response) => {
    const paymentId = parseInt(req.params.id);

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.isActive) {
            return res.status(400).json({ message: "Payment already verified" });
        }

        const updatedPayment = await prisma.payment.update({
            where: { id: paymentId },
            data: { isActive: true }
        });

        // Update tournament's currentAmount
        await prisma.tournament.update({
            where: { id: payment.tournamentId },
            data: {
                currentAmount: {
                    increment: payment.amount
                }
            }
        });

        res.json({ message: "Payment verified successfully", payment: updatedPayment });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
