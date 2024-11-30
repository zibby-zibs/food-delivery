import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: string;
  status: "preparing" | "ready" | "delivered";
  time: string;
}

export function RecentOrders() {
  const orders: Order[] = [
    {
      id: "#12345",
      customer: "John D.",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: "\u20A6 23.50",
      status: "preparing",
      time: "5 mins ago",
    },
    {
      id: "#12344",
      customer: "Sarah M.",
      items: ["Pasta Carbonara", "Tiramisu"],
      total: "\u20A6 28.90",
      status: "ready",
      time: "12 mins ago",
    },
    {
      id: "#12343",
      customer: "Mike R.",
      items: ["Caesar Salad", "Lasagna", "Coke"],
      total: "\u20A6 32.20",
      status: "delivered",
      time: "24 mins ago",
    },
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-green-500";
      case "delivered":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest customer orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{order.customer[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{order.total}</p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(order.status)} text-white`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
