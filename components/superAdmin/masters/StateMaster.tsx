"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { context } from "../../../context/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StateSchema } from "@/lib/schemas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";

type StateT = { id: number; name: string };

export default function StateMaster() {
  const { states, refreshStates } = context();
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<null | StateT>(null);
  const [query, setQuery] = useState("");
  const list = states || [];

  const createForm = useForm({
    resolver: zodResolver(StateSchema),
    defaultValues: { name: "" },
  });
  const editForm = useForm({
    resolver: zodResolver(StateSchema),
    defaultValues: { name: "" },
  });

  async function handleCreate(data: any) {
    try {
      const res = await fetch("/api/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowCreate(false);
        createForm.reset();
        refreshStates();
      } else alert(j.error || "Create failed");
    } catch (e) {
      alert("Network error");
    }
  }

  async function handleEdit(data: any) {
    if (!showEdit) return;
    try {
      const res = await fetch(`/api/states/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowEdit(null);
        editForm.reset();
        refreshStates();
      } else alert(j.error || "Update failed");
    } catch (e) {
      alert("Network error");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this state?")) return;
    try {
      const res = await fetch(`/api/states/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) refreshStates();
      else alert("Delete failed");
    } catch (e) {
      alert("Network error");
    }
  }

  const filtered = list.filter((s: any) =>
    (s.name || "").toString().toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">States</CardTitle>
              <CardDescription>
                Manage your states and their information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshStates()}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {/* <span className="ml-2 hidden sm:inline">Refresh</span> */}
                </Button>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus className="w-4 h-4" />
                  {/* <span className="ml-2 hidden sm:inline">Add State</span> */}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search states..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%]">Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        No states found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowEdit(s);
                              editForm.setValue("name", s.name || "");
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            <span className="ml-2 hidden sm:inline">Edit</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setShowEdit(s);
                                  editForm.setValue("name", s.name || "");
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(s.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New State</DialogTitle>
            <DialogDescription>
              Add a new state to your system. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  State Name
                </label>
                <Input
                  id="name"
                  {...createForm.register("name")}
                  placeholder="Enter state name"
                />
                {createForm.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {(createForm.formState.errors.name as any).message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create State</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!showEdit}
        onOpenChange={(open) => !open && setShowEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit State</DialogTitle>
            <DialogDescription>
              Make changes to the state. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  State Name
                </label>
                <Input
                  id="edit-name"
                  {...editForm.register("name")}
                  defaultValue={showEdit?.name}
                  placeholder="Enter state name"
                />
                {editForm.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {(editForm.formState.errors.name as any).message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
