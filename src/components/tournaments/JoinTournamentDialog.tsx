"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { joinTournament } from "@/lib/api";

interface JoinTournamentDialogProps {
    tournamentId: number;
    fee: number;
    disabled: boolean;
    disabledText: string;
}

export function JoinTournamentDialog({ tournamentId, fee, disabled, disabledText }: JoinTournamentDialogProps) {
  const tournamentWallet = "TXYZ...YourTournamentWalletAddress...1234"; // This should come from the backend in a real app
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!txHash) {
        toast({ title: "Error", description: "Please enter a transaction hash.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    try {
        await joinTournament(tournamentId, txHash);
        toast({ title: "Registration Submitted!", description: "Your payment is pending verification by an admin." });
        setOpen(false);
        setTxHash("");
    } catch (error: any) {
        toast({ title: "Registration Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full font-bold text-lg bg-accent hover:bg-accent/90 hover:shadow-glow-accent transition-all duration-300" disabled={disabled}>
          {disabled ? disabledText : `Join for ${fee} USDT`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-md border-accent/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-accent">Join Tournament</DialogTitle>
          <DialogDescription className="font-body">
            Complete your registration by submitting the transaction hash.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 font-body">
          <p className="text-sm">
            1. Send exactly <strong>{fee} USDT (TRC20)</strong> to the following wallet address:
          </p>
          <Input readOnly value={tournamentWallet} className="font-mono text-center bg-secondary"/>
          <p className="text-sm">
            2. Copy the transaction hash (TxHash) from your wallet after sending.
          </p>
          <p className="text-sm">
            3. Paste the TxHash below and submit for verification.
          </p>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-hash" className="text-right font-headline">
              TxHash
            </Label>
            <Input id="tx-hash" placeholder="0x..." className="col-span-3" value={txHash} onChange={(e) => setTxHash(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit for Verification"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
