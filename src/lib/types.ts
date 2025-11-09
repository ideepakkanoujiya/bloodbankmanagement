export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  contact: string;
  lastDonation: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  status: "pending" | "fulfilled";
  requestDate: string;
}

export interface InventoryItem {
  bloodGroup: BloodGroup;
  units: number;
}
