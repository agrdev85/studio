import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsTab } from "./PaymentsTab";
import { Card, CardContent } from "../ui/card";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="payments" className="w-full">
      <TabsList className="grid w-full grid-cols-3 font-headline">
        <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="payments">Payment Verification</TabsTrigger>
      </TabsList>
      <TabsContent value="tournaments">
        <Card className="bg-card/80">
            <CardContent className="p-6">
                <p>Tournament management interface will be here.</p>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <Card className="bg-card/80">
            <CardContent className="p-6">
                <p>User management interface will be here.</p>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="payments">
        <PaymentsTab />
      </TabsContent>
    </Tabs>
  );
}
