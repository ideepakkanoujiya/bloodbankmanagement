"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useBloodData } from "@/hooks/use-blood-data";
import PageHeader from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const cardStyles = "bg-card/40 backdrop-blur-lg border border-primary/10 rounded-2xl shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.05] hover:border-primary/20 hover:backdrop-blur-xl";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { resetData } = useBloodData();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReset = () => {
    resetData();
    toast({
        title: "Data Reset",
        description: "All application data has been reset to default.",
        variant: "destructive"
    })
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description="Customize your application settings."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Toggle between light and dark mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Reset all application data to its initial state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Reset Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all donors, requests, and inventory data from your local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
