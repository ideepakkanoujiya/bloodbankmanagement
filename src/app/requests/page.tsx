"use client";
import * as React from "react";
import { useBloodData } from "@/hooks/use-blood-data";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { BloodRequest, bloodGroups } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "@/components/data-table";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  units: z.coerce.number().min(1, "At least 1 unit must be requested."),
  bloodGroup: z.enum(bloodGroups),
});

export default function RequestsPage() {
  const { requests, addRequest, updateRequestStatus, isInitialized } = useBloodData();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { patientName: "", units: 1, bloodGroup: "A+" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addRequest(values);
    toast({
      title: "Success",
      description: "New blood request has been submitted.",
    });
    form.reset();
    setIsFormOpen(false);
  }

  const columns: ColumnDef<BloodRequest>[] = [
    { accessorKey: "patientName", header: "Patient Name" },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => <Badge variant="secondary">{row.original.bloodGroup}</Badge>,
    },
    { accessorKey: "units", header: "Units" },
    { accessorKey: "requestDate", header: "Request Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'fulfilled' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Fulfill",
      cell: ({ row }) => {
        const isFulfilled = row.original.status === "fulfilled";
        return (
          <Switch
            checked={isFulfilled}
            onCheckedChange={(checked) => {
              updateRequestStatus(row.original.id, checked ? "fulfilled" : "pending");
            }}
            aria-label="Fulfill request"
            disabled={isFulfilled}
          />
        );
      },
    },
  ];

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Blood Requests"
        description="Submit and track blood requests."
        actions={
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Blood Request</DialogTitle>
                <DialogDescription>
                  Fill in the patient details to request blood.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Units Required</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodGroups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Submit Request</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-card/40 backdrop-blur-lg border border-primary/10 rounded-2xl p-4 shadow-lg shadow-primary/5">
        <DataTable columns={columns} data={requests} />
      </div>
    </div>
  );
}
