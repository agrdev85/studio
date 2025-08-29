import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ThreeScene } from "./ThreeScene";

export function HeroSection() {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6 p-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-widest uppercase text-shadow-lg animate-fade-in-down">
          <span className="text-primary">CUFIRE</span> Tournaments
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-body">
          The ultimate competitive FPS platform. Join free-for-all matches or high-stakes USDT tournaments. Climb the ranks and claim your glory.
        </p>
        <Button size="lg" asChild className="font-bold text-lg bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-glow-primary transition-all duration-300">
          <Link href="#tournaments">
            Explore Tournaments
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
