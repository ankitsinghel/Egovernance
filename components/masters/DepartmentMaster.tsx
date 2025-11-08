"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { context } from "../../context/context";
import Pagination from "@/components/ui/pagination";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentSchema } from "../../lib/schemas";
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
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import { Department } from "@/lib/types";

export default function DepartmentMaster() {
  const {
    departments,
    setDepartments,
    refreshDepartments,
    loading,
    setLoading,
  } = context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<null | Department>(null);
  const [query, setQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  function promptDelete(id: number) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }
  const list = departments || [];

  const createForm = useForm<{ name: string }>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: { name: "" },
  });
  const editForm = useForm<{ name: string }>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: { name: "" },
  });

  async function handleCreate(data: { name: string }) {
    try {
      setLoading(true);
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setLoading(false);
        setShowCreate(false);
        createForm.reset();
        setDepartments([...list, j.department]);
        if (j.message) toast.success(j.message);
      } else {
        setLoading(false);
        toast.error(j.error || "Create failed");
      }
    } catch (e) {
      setLoading(false);
      toast.error("Network error");
    }
  }

  async function handleEdit(data: { name: string }) {
    if (!showEdit) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/departments/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setLoading(false);
        setShowEdit(null);
        editForm.reset();
        setDepartments(
          list.map((d) => (d.id === showEdit.id ? j.department : d))
        );
        if (j.message) toast.success(j.message);
      } else toast.error(j.error || "Update failed");
    } catch (e) {
      setLoading(false);
      toast.error("Network error");
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setDepartments(list.filter((d) => d.id !== id));
        if (j.message) toast.success(j.message);
      } else toast.error(j.message || "Delete failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
    }
  }

  async function handleRefresh() {
    setLoading(true);
    try {
      await refreshDepartments();
    } finally {
      setLoading(false);
    }
  }

  const filtered = list.filter((d: Department) =>
    (d.name || "").toString().toLowerCase().includes(query.toLowerCase().trim())
  );
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => setPage(1), [query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Departments</CardTitle>
              <CardDescription>
                Manage your departments and their information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {/* <span className="ml-2 hidden sm:inline">Refresh</span> */}
                </Button>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus className="w-4 h-4" />
                  {/* <span className="ml-2 hidden sm:inline">Add Department</span> */}
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
                placeholder="Search departments..."
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        {list.length === 0
                          ? "No departments found."
                          : "No departments match your search."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((d: Department) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.id}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowEdit(d);
                              editForm.setValue("name", d.name || "");
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
                                  setShowEdit(d);
                                  editForm.setValue("name", d.name || "");
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => promptDelete(d.id)}
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
        {/* pagination */}
        <CardContent className="pt-0">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </CardContent>
      </Card>

      {/* Delete Confirmation (shared) */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Confirm Delete"
        description="Are you sure you want to delete this department? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteTargetId(null);
        }}
        onConfirm={async () => {
          if (deleteTargetId) await handleDelete(deleteTargetId);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to your system. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Department Name
                </label>
                <Input
                  id="name"
                  {...createForm.register("name")}
                  placeholder="Enter department name"
                />
                {createForm.formState.errors.name?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {String(createForm.formState.errors.name?.message)}
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
              <Button type="submit">Create Department</Button>
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
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Make changes to the department. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Department Name
                </label>
                <Input
                  id="edit-name"
                  {...editForm.register("name")}
                  defaultValue={showEdit?.name}
                  placeholder="Enter department name"
                />
                {editForm.formState.errors.name?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {String(editForm.formState.errors.name?.message)}
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
