"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Trash2, Edit, ChevronLeft, ChevronRight, Plus } from "lucide-react";

function useDebounced(value: string, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function StatesMaster() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 300);
  const [sort, setSort] = useState("name.asc");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/states?q=${encodeURIComponent(
          debouncedQ
        )}&sort=${sort}&limit=${limit}&offset=${offset}`
      );
      const j = await res.json();
      if (j.ok) {
        setItems(j.items || []);
        setTotal(j.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [debouncedQ, sort, limit, offset]);

  async function createState(name: string) {
    const res = await fetch("/api/states", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    const j = await res.json();
    if (j.ok) load();
  }
  async function updateState(id: number, name: string) {
    const res = await fetch(`/api/states/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    const j = await res.json();
    if (j.ok) load();
  }
  async function deleteState(id: number) {
    if (!confirm("Delete this state?")) return;
    const res = await fetch(`/api/states/${id}`, { method: "DELETE" });
    const j = await res.json();
    if (j.ok) load();
  }

  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">States</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search states"
            value={q}
            onChange={(e: any) => {
              setQ(e.target.value);
              setOffset(0);
            }}
            className="w-64"
          />
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4" />
            Create
          </Button>
          {showCreate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Create State</h3>
                <input
                  placeholder="State name"
                  id="create-state-name"
                  className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const v = (
                        document.getElementById(
                          "create-state-name"
                        ) as HTMLInputElement
                      ).value;
                      if (v) createState(v);
                      setShowCreate(false);
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">
                  <button
                    onClick={() =>
                      setSort(sort === "name.asc" ? "name.desc" : "name.asc")
                    }
                    className="flex items-center gap-2"
                  >
                    Name
                  </button>
                </th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center">
                    No states
                  </td>
                </tr>
              ) : (
                items.map((it: any, i: number) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2">{offset + i + 1}</td>
                    <td className="p-2">{it.name}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(it.id);
                            const v = document.getElementById(
                              `edit-state-name-${it.id}`
                            ) as HTMLInputElement;
                            if (v) v.value = it.name;
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteState(it.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      {editingId === it.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded shadow max-w-md w-full">
                            <h3 className="text-lg font-semibold mb-4">
                              Edit State
                            </h3>
                            <input
                              id={`edit-state-name-${it.id}`}
                              defaultValue={it.name}
                              className="w-full p-2 border rounded mb-4"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  const v = (
                                    document.getElementById(
                                      `edit-state-name-${it.id}`
                                    ) as HTMLInputElement
                                  ).value;
                                  if (v) updateState(it.id, v);
                                  setEditingId(null);
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-slate-600">
              Showing {Math.min(total, offset + 1)} -{" "}
              {Math.min(total, offset + limit)} of {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm">
              {page} / {pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setOffset(Math.min((pages - 1) * limit, offset + limit))
              }
              disabled={page === pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
              className="ml-2 p-1 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
