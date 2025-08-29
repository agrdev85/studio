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
import { LogIn } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border-primary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-widest text-primary">Login</CardTitle>
        <CardDescription className="font-body">Access your CUFIRE account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-headline tracking-wider">Email</Label>
          <Input id="email" type="email" placeholder="player@cufire.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="font-headline tracking-wider">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full font-bold text-lg bg-primary hover:bg-primary/90 hover:shadow-glow-primary transition-all duration-300">
            <LogIn className="mr-2 h-5 w-5"/>
            Sign In
        </Button>
        <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 text-accent">
                <Link href="/register">Register now</Link>
            </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
