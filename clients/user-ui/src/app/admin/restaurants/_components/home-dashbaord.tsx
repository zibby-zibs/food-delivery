import { PopularDishes } from "./popular-dishes";
import { RecentOrders } from "./recent-orders";
import { StatsCards } from "./stats-cards";

export function RestaurantDashboard() {
  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Store Overview</h2>
      </div>
      <StatsCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentOrders />
        </div>
        <div className="col-span-3">
          <PopularDishes />
        </div>
      </div>
    </div>
  );
}
