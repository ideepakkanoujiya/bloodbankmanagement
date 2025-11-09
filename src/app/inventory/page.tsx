"use client";
import * as React from "react";
import { useBloodData } from "@/hooks/use-blood-data";
import PageHeader from "@/components/shared/page-header";
import { InventoryItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const { inventory, updateInventory, isInitialized } = useBloodData();
  const [editableInventory, setEditableInventory] = React.useState<InventoryItem[]>([]);

  React.useEffect(() => {
    if (isInitialized) {
      setEditableInventory(JSON.parse(JSON.stringify(inventory)));
    }
  }, [inventory, isInitialized]);
  
  const handleUnitChange = (bloodGroup: string, value: string) => {
    const units = parseInt(value, 10);
    if (!isNaN(units)) {
      setEditableInventory((prev) =>
        prev.map((item) => (item.bloodGroup === bloodGroup ? { ...item, units } : item))
      );
    }
  };

  const handleUpdate = (bloodGroup: string) => {
    const itemToUpdate = editableInventory.find(item => item.bloodGroup === bloodGroup);
    if (itemToUpdate) {
        updateInventory(bloodGroup, itemToUpdate.units);
        toast({
            title: "Inventory Updated",
            description: `Stock for ${bloodGroup} set to ${itemToUpdate.units} units.`
        });
    }
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Inventory" description="View and manage blood stock levels." />
      <div className="bg-card/40 backdrop-blur-lg border border-primary/10 rounded-2xl p-4 shadow-lg shadow-primary/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Blood Group</TableHead>
              <TableHead>Units Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editableInventory.map((item) => (
              <TableRow key={item.bloodGroup}>
                <TableCell>
                  <Badge variant="outline" className="border-primary/50 text-primary">{item.bloodGroup}</Badge>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.units}
                    onChange={(e) => handleUnitChange(item.bloodGroup, e.target.value)}
                    className="w-24 bg-background"
                  />
                </TableCell>
                <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleUpdate(item.bloodGroup)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
