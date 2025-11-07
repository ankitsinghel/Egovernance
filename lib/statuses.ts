// Central list of statuses used across the app.
// Each status has a numeric id stored in DB and a key (string) used for labels.

import {StatusItem} from "@/lib/types"
export const STATUSES: StatusItem[] = [
  { id: 1, key: "pending", label: "Pending" },
  { id: 2, key: "in_progress", label: "In Progress" },
  { id: 3, key: "resolved", label: "Resolved" },
  { id: 4, key: "closed", label: "Closed" },
];

export function findStatusById(id: number) {
  return STATUSES.find((s) => s.id === id) ?? null;
}

export function findStatusByKey(key: string) {
  return STATUSES.find((s) => s.key === key) ?? null;
}

export function statusLabel(id: number) {
  return findStatusById(id)?.label ?? String(id);
}

export function statusKey(id: number) {
  return findStatusById(id)?.key ?? String(id);
}

export function defaultStatusId() {
  return STATUSES[0].id;
}
