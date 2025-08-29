"use client";

import { useState } from 'react';
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
import { mockPayments } from "@/lib/mock-data";
import { Badge } from "../ui/badge";
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { Payment } from '@/lib/types';

export function PaymentsTab() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const handleVerify = (paymentId: number) => {
    setPayments(prevPayments => 
      prevPayments.map(p => 
        p.id === paymentId ? { ...p, isActive: true } : p
      )
    );
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
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.username}</TableCell>
                <TableCell className="font-mono text-xs">{payment.txHash}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
