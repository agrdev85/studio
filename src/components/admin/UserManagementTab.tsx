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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAllUsersAdmin } from "@/lib/api";
import { User } from "@/lib/types";
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

export function UserManagementTab() {
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsersAdmin();
                setUsers(data);
            } catch (error) {
                toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
            }
        };
        fetchUsers();
    }, [toast]);

    return (
        <Card className="bg-card/80">
            <CardHeader>
                <CardTitle className="font-headline tracking-wider">User Management</CardTitle>
                <CardDescription>View and manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>USDT Wallet</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="font-mono text-xs">{user.usdtWallet}</TableCell>
                                <TableCell>
                                    {user.isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="secondary">Player</Badge>}
                                </TableCell>
                                <TableCell>{format(new Date(user.createdAt), 'PP')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
