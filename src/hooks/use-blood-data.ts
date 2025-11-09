"use client";

import { useState, useEffect, useCallback } from "react";
import { Donor, BloodRequest, InventoryItem, bloodGroups } from "@/lib/types";
import { format } from "date-fns";

const initialInventory: InventoryItem[] = bloodGroups.map((group) => ({
  bloodGroup: group,
  units: Math.floor(Math.random() * 20) + 5,
}));

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
  const [donors, setDonors] = useLocalStorage<Donor[]>("bloodflow_donors", []);
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
    setDonors([]);
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
