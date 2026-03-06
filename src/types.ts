export type Category = "UX" | "Frontend" | "Backend";
export type Status = "new" | "doing" | "done";

export interface Member {
  id: string;
  name: string;
  category: Category;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  assignedTo: string | null;
  timestamp: string;
}