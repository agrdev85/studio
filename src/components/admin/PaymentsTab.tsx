"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { PaymentWithUser } from '@/lib/types';
import { getPendingPayments, verifyPayment } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function PaymentsTab() {
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPendingPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch pending payments", error);
        toast({ title: "Error", description: "Could not load pending payments.", variant: "destructive" });
      }
    };
    fetchPayments();
  }, [toast]);

  const handleVerify = async (paymentId: number) => {
    try {
        await verifyPayment(paymentId);
        setPayments(prevPayments => prevPayments.filter(p => p.id !== paymentId));
        toast({ title: "Success", description: "Payment verified and tournament amount updated." });
    } catch (error: any) {
        console.error("Failed to verify payment", error);
        toast({ title: "Verification Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    }
  };
  
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline tracking-wider">Pending Payments</CardTitle>
        <CardDescription>Verify user payments to activate their tournament registration.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>TxHash</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No pending payments to verify.</TableCell>
              </TableRow>
            ) : (
                payments.map((payment) => (
                <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.user.username}</TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-xs" title={payment.txHash}>{payment.txHash}</TableCell>
                    <TableCell>{payment.amount} USDT</TableCell>
                    <TableCell>
                    {payment.isActive ? (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verified
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-400" />
                        Pending
                        </Badge>
                    )}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button 
                        size="sm" 
                        onClick={() => handleVerify(payment.id)} 
                        disabled={payment.isActive}
                        className="bg-primary hover:bg-primary/90 disabled:bg-green-500 disabled:opacity-100"
                        >
                        {payment.isActive ? 'Verified' : 'Verify'}
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
