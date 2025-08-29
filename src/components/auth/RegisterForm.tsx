"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  return (
    <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border-accent/30">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-widest text-accent">Register</CardTitle>
        <CardDescription className="font-body">Create your CUFIRE account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="font-headline tracking-wider">Username</Label>
          <Input id="username" placeholder="CyberPlayer123" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-headline tracking-wider">Email</Label>
          <Input id="email" type="email" placeholder="player@cufire.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="font-headline tracking-wider">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usdt-wallet" className="font-headline tracking-wider">USDT Wallet (TRC20)</Label>
          <Input id="usdt-wallet" placeholder="T..." required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full font-bold text-lg bg-accent hover:bg-accent/90 hover:shadow-glow-accent transition-all duration-300">
            <UserPlus className="mr-2 h-5 w-5"/>
            Create Account
        </Button>
        <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/login">Login</Link>
            </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
