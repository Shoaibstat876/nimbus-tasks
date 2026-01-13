export type FilterMode = "all" | "active" | "completed";

export type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
