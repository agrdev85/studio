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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAllTournamentsAdmin, createTournament, deleteTournament } from "@/lib/api";
import type { TournamentWithRelations } from "@/lib/types";
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TournamentManagementTab() {
  const [tournaments, setTournaments] = useState<TournamentWithRelations[]>([]);
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    maxPlayers: '',
    maxAmount: '',
    duration: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchTournaments = async () => {
    try {
      const data = await getAllTournamentsAdmin();
      setTournaments(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load tournaments.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTournament = async () => {
    try {
      const created = await createTournament(newTournament);
      setTournaments([created, ...tournaments]);
      toast({ title: "Success", description: "Tournament created successfully." });
      setIsDialogOpen(false);
      setNewTournament({ name: '', description: '', maxPlayers: '', maxAmount: '', duration: '' });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create tournament.", variant: "destructive" });
    }
  };
  
  const handleDeleteTournament = async (id: number) => {
    try {
        await deleteTournament(id);
        setTournaments(tournaments.filter(t => t.id !== id));
        toast({title: "Success", description: "Tournament deleted."});
    } catch (error: any) {
        toast({title: "Error", description: error.message || "Failed to delete tournament.", variant: "destructive"});
    }
  }

  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline tracking-wider">Tournament Management</CardTitle>
          <CardDescription>Create, view, and manage all tournaments.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" />Create Tournament</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card/95">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary">Create New Tournament</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={newTournament.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={newTournament.description} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="maxPlayers">Max Players</Label>
                    <Input id="maxPlayers" name="maxPlayers" type="number" value={newTournament.maxPlayers} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="maxAmount">Prize Pool Target (€)</Label>
                    <Input id="maxAmount" name="maxAmount" type="number" value={newTournament.maxAmount} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" name="duration" type="number" value={newTournament.duration} onChange={handleInputChange} />
              </div>
            </div>
            <Button onClick={handleCreateTournament} className="w-full">Create</Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Current Pool</TableHead>
              <TableHead>Target Pool</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.isActive ? "Active" : "Finished"}</TableCell>
                <TableCell>{t.registrations.length} / {t.maxPlayers || '∞'}</TableCell>
                <TableCell>${t.currentAmount.toLocaleString()}</TableCell>
                <TableCell>${t.maxAmount?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell className="text-right">
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tournament and all associated registrations, payments, and scores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTournament(t.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
