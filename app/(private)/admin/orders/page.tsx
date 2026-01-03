import { getAdminOrders } from "@/app/actions/admin";
import { OrdersTable } from "./_components/orders-table";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage all platform orders</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
