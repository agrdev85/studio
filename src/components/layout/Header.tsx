"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Shield, UserPlus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg tracking-wider">CUFIRE</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground hover:shadow-glow-accent transition-all duration-300" asChild>
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-primary transition-all duration-300" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
