"use client";

import React, { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PermissionSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { context } from "@/context/context";
import Pagination from "@/components/ui/pagination";
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
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Permission } from "@/lib/types";
import { ButtonGroup } from "@/components/ui/button-group";

export default function PermissionMaster() {
  const [loading, setLoading] = useState(false);
  const {
    setLoading: setGlobalLoading,
    permissions,
    refreshPermissions,
    setPermissions,
  } = context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Permission | null>(null);
  const [query, setQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const createForm = useForm({
    resolver: zodResolver(PermissionSchema),
    defaultValues: { name: "", description: "" },
  });
  const editForm = useForm({
    resolver: zodResolver(PermissionSchema),
    defaultValues: { name: "", description: "" },
  });

  async function handleCreate(data: Permission) {
    try {
      setLoading(true);
      setGlobalLoading(true);
      const res = await fetch("/api/super-admin/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowCreate(false);
        createForm.reset();
        setPermissions([...permissions, j.perm]);
        toast.success(j.message || "Permission created");
      } else toast.error(j.message || "Create failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }

  async function handleEdit(data: Permission) {
    if (!showEdit) return;
    try {
      setGlobalLoading(true);
      const res = await fetch(`/api/super-admin/permissions/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowEdit(null);
        editForm.reset();
        setPermissions(
          permissions.map((p) => (p.id === j.perm.id ? j.perm : p))
        );
        toast.success(j.message || "Permission updated");
      } else toast.error(j.message || "Update failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setGlobalLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(true);
      setGlobalLoading(true);
      const res = await fetch(`/api/super-admin/permissions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setPermissions(permissions.filter((p) => p.id !== id));
        toast.success(j.message || "Permission deleted");
      } else toast.error(j.message || "Delete failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
      setLoading(false);
      setGlobalLoading(false);
    }
  }

  function promptDelete(id: number) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }

  const filtered = permissions.filter((p) =>
    (p.name || "").toString().toLowerCase().includes(query.toLowerCase().trim())
  );
  // pagination
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  // keep page sane when filters change
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
              <CardTitle className="text-2xl font-bold">Permissions</CardTitle>
              <CardDescription>
                Manage permissions used by roles
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshPermissions()}
                >
                  <RefreshCw className={`w-4 h-4 `} />
                </Button>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus className="w-4 h-4" />
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
                placeholder="Search permissions..."
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
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        No permissions found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((p: Permission) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowEdit(p);
                              editForm.setValue("name", p.name || "");
                              editForm.setValue(
                                "description",
                                p.description || ""
                              );
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
                                  setShowEdit(p);
                                  editForm.setValue("name", p.name || "");
                                  editForm.setValue(
                                    "description",
                                    p.description || ""
                                  );
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => promptDelete(p.id)}
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

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Add a new permission. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Permission Name
                </label>
                <Input
                  id="name"
                  {...createForm.register("name")}
                  placeholder="Enter permission name"
                />
                {createForm.formState.errors.name?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {String(createForm.formState.errors.name?.message)}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="desc" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="desc"
                  {...createForm.register("description")}
                  placeholder="Short description (optional)"
                />
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
              <Button type="submit">Create Permission</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteTargetId(null);
        }}
        onConfirm={async () => {
          if (deleteTargetId) await handleDelete(deleteTargetId);
        }}
        title="Confirm Delete"
        description={`Are you sure you want to delete this permission? This action cannot be undone.`}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!showEdit}
        onOpenChange={(open) => !open && setShowEdit(null)}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Make changes to the permission. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Permission Name
                </label>
                <Input
                  id="edit-name"
                  {...editForm.register("name")}
                  defaultValue={showEdit?.name}
                  placeholder="Enter permission name"
                />
                {editForm.formState.errors.name?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {String(editForm.formState.errors.name?.message)}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-desc" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-desc"
                  {...editForm.register("description")}
                  defaultValue={showEdit?.description}
                  placeholder="Short description (optional)"
                />
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
