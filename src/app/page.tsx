"use client";

import { useBloodData } from "@/hooks/use-blood-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Hourglass, Droplets } from "lucide-react";
import PageHeader from "@/components/shared/page-header";

const cardStyles =
  "bg-card/40 backdrop-blur-lg border border-primary/10 rounded-2xl shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.05] hover:border-primary/20 hover:backdrop-blur-xl";

export default function DashboardPage() {
  const { donors, requests, inventory } = useBloodData();

  const pendingRequests = requests.filter(
    (req) => req.status === "pending"
  ).length;
  const totalStock = inventory.reduce((acc, item) => acc + item.units, 0);

  const stats = [
    {
      title: "Total Donors",
      value: donors.length,
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: <Hourglass className="h-8 w-8 text-accent" />,
    },
    {
      title: "Total Blood Stock",
      value: `${totalStock} units`,
      icon: <Droplets className="h-8 w-8 text-destructive" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" description="An overview of your blood bank status." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className={cardStyles}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/60">Recent activity feed coming soon.</p>
          </CardContent>
        </Card>
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/60">Quick action buttons coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
