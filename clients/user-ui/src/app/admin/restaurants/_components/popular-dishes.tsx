import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Dish {
  name: string;
  orders: number;
  revenue: string;
  trend: number;
}

export function PopularDishes() {
  const dishes: Dish[] = [
    {
      name: "Margherita Pizza",
      orders: 145,
      revenue: "\u20A6 1,450",
      trend: 23,
    },
    {
      name: "Pasta Carbonara",
      orders: 132,
      revenue: "\u20A6 1,320",
      trend: 18,
    },
    {
      name: "Tiramisu",
      orders: 97,
      revenue: "\u20A6 679",
      trend: 12,
    },
    {
      name: "Caesar Salad",
      orders: 89,
      revenue: "\u20A6 623",
      trend: -5,
    },
  ];

  const maxOrders = Math.max(...dishes.map((dish) => dish.orders));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Dishes</CardTitle>
        <CardDescription>Top performing menu items this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dishes.map((dish) => (
            <div key={dish.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{dish.name}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{dish.orders} orders</span>
                  <span>•</span>
                  <span>{dish.revenue}</span>
                </div>
              </div>
              <Progress value={(dish.orders / maxOrders) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
