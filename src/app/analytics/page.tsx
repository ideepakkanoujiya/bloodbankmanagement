"use client";

import PageHeader from "@/components/shared/page-header";
import { useBloodData } from "@/hooks/use-blood-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartConfig = {
  units: { label: "Units" },
  donors: { label: "Donors" },
  "A+": { label: "A+", color: "hsl(var(--chart-1))" },
  "A-": { label: "A-", color: "hsl(var(--chart-2))" },
  "B+": { label: "B+", color: "hsl(var(--chart-3))" },
  "B-": { label: "B-", color: "hsl(var(--chart-4))" },
  "AB+": { label: "AB+", color: "hsl(var(--chart-5))" },
  "AB-": { label: "AB-", color: "hsl(var(--chart-1))" },
  "O+": { label: "O+", color: "hsl(var(--chart-2))" },
  "O-": { label: "O-", color: "hsl(var(--chart-3))" },
};

const cardStyles = "bg-card/40 backdrop-blur-lg border border-primary/10 rounded-2xl shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.05] hover:border-primary/20 hover:backdrop-blur-xl";

export default function AnalyticsPage() {
  const { inventory, donors, isInitialized } = useBloodData();

  const inventoryData = inventory.map(item => ({
    name: item.bloodGroup,
    value: item.units,
    fill: chartConfig[item.bloodGroup]?.color || 'hsl(var(--primary))'
  }));

  const donorDistribution = Object.entries(
    donors.reduce((acc, donor) => {
      acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, donors: value }));


  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analytics"
        description="Visualize your blood bank data."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Blood Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={inventoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
                    {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cardStyles}>
            <CardHeader>
                <CardTitle>Donor Distribution by Blood Type</CardTitle>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart data={donorDistribution} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="donors" radius={8}>
                            {donorDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
