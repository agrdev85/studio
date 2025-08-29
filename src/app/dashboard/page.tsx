import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline tracking-widest uppercase text-primary mb-8">
        Admin Dashboard
      </h1>
      <AdminDashboard />
    </div>
  );
}
