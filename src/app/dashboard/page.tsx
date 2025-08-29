import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline tracking-widest uppercase text-primary mb-8">
        Admin Dashboard
      </h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="w-full">
            <div className="flex space-x-1 rounded-md bg-muted p-1 mb-4">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}
