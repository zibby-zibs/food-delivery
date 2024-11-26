import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  Utensils,
  Clock,
  DollarSign,
} from "lucide-react";

interface Stat {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.ReactNode;
}

export function StatsCards() {
  const stats: Stat[] = [
    {
      title: "Total Revenue",
      value: "£2,389.50",
      description: "Daily revenue",
      trend: 12.5,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Active Orders",
      value: "18",
      description: "Orders in progress",
      trend: -2.3,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Customers",
      value: "342",
      description: "Daily customers",
      trend: 8.1,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Popular Dishes",
      value: "6",
      description: "Trending today",
      trend: 4.2,
      icon: <Utensils className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <span
                className={`flex items-center text-xs ${
                  stat.trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend > 0 ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {Math.abs(stat.trend)}%
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
