import { type Assignment, type Member } from "./types";

const API = "http://localhost:3000";

export const getMembers = async (): Promise<Member[]> => {
  const res = await fetch(`${API}/members`);
  const data = await res.json();
  return Object.values(data.details || {});
};

export const addMember = async (name: string, category: string) => {
  await fetch(`${API}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category })
  });
};

export const getAssignments = async (): Promise<Assignment[]> => {
  const res = await fetch(`${API}/assignments`);
  const data = await res.json();
  return Object.values(data.details || {});
};

export const addAssignment = async (
  title: string,
  description: string,
  category: string
) => {
  await fetch(`${API}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, category })
  });
};

export const assignTask = async (assignmentId: string, memberId: string) => {
  await fetch(`${API}/assignments/${assignmentId}/assign/${memberId}`, {
    method: "PATCH"
  });
};

export const markDone = async (assignmentId: string) => {
  await fetch(`${API}/assignments/${assignmentId}/done`, {
    method: "PATCH"
  });
};

export const deleteTask = async (assignmentId: string) => {
  await fetch(`${API}/assignments/${assignmentId}`, {
    method: "DELETE"
  });
};

export const deleteMember = async (id: string) => {
  await fetch(`${API}/members/${id}`, {
    method: "DELETE"
  });
};