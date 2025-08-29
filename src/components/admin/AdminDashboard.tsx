import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsTab } from "./PaymentsTab";
import { TournamentManagementTab } from "./TournamentManagementTab";
import { UserManagementTab } from "./UserManagementTab";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="tournaments" className="w-full">
      <TabsList className="grid w-full grid-cols-3 font-headline">
        <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="payments">Payment Verification</TabsTrigger>
      </TabsList>
      <TabsContent value="tournaments">
        <TournamentManagementTab />
      </TabsContent>
      <TabsContent value="users">
        <UserManagementTab />
      </TabsContent>
      <TabsContent value="payments">
        <PaymentsTab />
      </TabsContent>
    </Tabs>
  );
}
