
"use client";

import { useState, useEffect, useCallback } from "react";
import { Donor, BloodRequest, InventoryItem, bloodGroups } from "@/lib/types";
import { format } from "date-fns";

const initialInventory: InventoryItem[] = bloodGroups.map((group) => ({
  bloodGroup: group,
  units: Math.floor(Math.random() * 20) + 5,
}));

const initialDonors: Donor[] = [
    { id: "d1", name: "Alice Johnson", bloodGroup: "O+", contact: "555-0101", lastDonation: "2023-05-15" },
    { id: "d2", name: "Bob Williams", bloodGroup: "A-", contact: "555-0102", lastDonation: "2023-07-22" },
    { id: "d3", name: "Charlie Brown", bloodGroup: "B+", contact: "555-0103", lastDonation: "2023-09-01" },
    { id: "d4", name: "Diana Miller", bloodGroup: "AB-", contact: "555-0104", lastDonation: "2023-11-18" },
    { id: "d5", name: "Ethan Davis", bloodGroup: "O-", contact: "555-0105", lastDonation: "2024-01-09" },
    { id: "d6", name: "Fiona Garcia", bloodGroup: "A+", contact: "555-0106", lastDonation: "2024-02-28" },
    { id: "d7", name: "George Rodriguez", bloodGroup: "B-", contact: "555-0107", lastDonation: "2024-03-12" },
    { id: "d8", name: "Hannah Martinez", bloodGroup: "AB+", contact: "555-0108", lastDonation: "2024-04-05" },
    { id: "d9", name: "Ian Clark", bloodGroup: "O+", contact: "555-0109", lastDonation: "2024-05-20" },
    { id: "d10", name: "Jessica Lewis", bloodGroup: "A-", contact: "555-0110", lastDonation: "2024-06-11" },
    { id: "d11", name: "Kevin Walker", bloodGroup: "B+", contact: "555-0111", lastDonation: "2024-07-01" },
];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useBloodData() {
  const [donors, setDonors] = useLocalStorage<Donor[]>("bloodflow_donors", initialDonors);
  const [requests, setRequests] = useLocalStorage<BloodRequest[]>("bloodflow_requests", []);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>("bloodflow_inventory", initialInventory);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);
  
  const addDonor = (donor: Omit<Donor, "id" | "lastDonation">) => {
    const newDonor: Donor = {
      ...donor,
      id: crypto.randomUUID(),
      lastDonation: format(new Date(), "yyyy-MM-dd"),
    };
    setDonors((prev) => [...prev, newDonor]);
  };

  const removeDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
  };

  const addRequest = (request: Omit<BloodRequest, "id" | "status" | "requestDate">) => {
    const newRequest: BloodRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: "pending",
      requestDate: format(new Date(), "yyyy-MM-dd"),
    };
    setRequests((prev) => [...prev, newRequest]);
  };
  
  const updateRequestStatus = (id: string, status: "pending" | "fulfilled") => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          // If fulfilling request, attempt to decrement inventory
          if (status === "fulfilled" && r.status === 'pending') {
            const stock = inventory.find(item => item.bloodGroup === r.bloodGroup);
            if (stock && stock.units >= r.units) {
               updateInventory(r.bloodGroup, stock.units - r.units);
               return { ...r, status };
            } else {
              // Not enough stock, cannot fulfill
              alert(`Not enough stock for blood group ${r.bloodGroup}. Request cannot be fulfilled.`);
              return r;
            }
          }
          return { ...r, status };
        }
        return r;
      })
    );
  };
  
  const updateInventory = (bloodGroup: string, units: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.bloodGroup === bloodGroup ? { ...item, units: Math.max(0, units) } : item
      )
    );
  };

  const resetData = useCallback(() => {
    setDonors(initialDonors);
    setRequests([]);
    setInventory(initialInventory);
  }, [setDonors, setRequests, setInventory]);

  if (!isInitialized) {
    return {
      donors: [],
      requests: [],
      inventory: bloodGroups.map(bg => ({ bloodGroup: bg, units: 0})),
      addDonor: () => {},
      removeDonor: () => {},
      addRequest: () => {},
      updateRequestStatus: () => {},
      updateInventory: () => {},
      resetData: () => {},
      isInitialized: false,
    };
  }

  return { donors, requests, inventory, addDonor, removeDonor, addRequest, updateRequestStatus, updateInventory, resetData, isInitialized };
}
