import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface PodiumIconProps {
  rank: number;
  className?: string;
}

export function PodiumIcon({ rank, className }: PodiumIconProps) {
  const rankClasses = {
    1: "text-amber-400 fill-amber-500/30",
    2: "text-slate-400 fill-slate-500/30",
    3: "text-orange-400 fill-orange-500/30",
  }[rank];

  return (
    <Award
      className={cn(
        "h-8 w-8",
        rankClasses,
        className
      )}
    />
  );
}
