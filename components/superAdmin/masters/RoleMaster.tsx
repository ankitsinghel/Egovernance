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
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSchema } from "@/lib/schemas";
import { context } from "@/context/context";
import { toast } from "sonner";

export default function RoleMaster() {
  const {
    roles,
    setRoles,
    permissions,
    refreshPermissions,
    loading,
    refreshRoles,
    setLoading,
  } = context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<any | null>(null);
  const [showPerms, setShowPerms] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);

  const createForm = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: { name: "" },
  });
  const editForm = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: { name: "" },
  });

  async function handleCreate(data: any) {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowCreate(false);
        createForm.reset();
        toast.success(j.message || "Role created");
      } else toast.error(j.message || "Create failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(data: any) {
    if (!showEdit) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/super-admin/roles/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setShowEdit(null);
        editForm.reset();
        toast.success(j.message || "Role updated");
      } else toast.error(j.message || "Update failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/super-admin/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) toast.success(j.message || "Role deleted");
      else toast.error(j.message || "Delete failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      // close any open delete dialog and refresh roles list
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
      if (refreshRoles) refreshRoles();
      setLoading(false);
    }
  }

  function promptDelete(id: number) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }

  function openManagePerms(role: any) {
    setShowPerms(role);
    const ids = (role.permissions || []).map((p: any) => p.id);
    setSelectedPerms(ids);
  }

  function togglePerm(id: number) {
    setSelectedPerms((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  async function savePerms() {
    if (!showPerms) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/super-admin/roles/${showPerms.id}/permissions`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissionIds: selectedPerms }),
          credentials: "include",
        }
      );
      const j = await res.json();
      if (j.ok) {
        setShowPerms(null);
        refreshPermissions();
      } else toast.error(j.message || "Save failed");
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = roles.filter((r: any) =>
    (r.name || "").toString().toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Roles</CardTitle>
              <CardDescription>
                Manage roles and their permissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshRoles()}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
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
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        No roles found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(r.permissions || []).length} perms
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openManagePerms(r)}
                          >
                            Perms
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowEdit(r);
                              editForm.setValue("name", r.name || "");
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
                                  setShowEdit(r);
                                  editForm.setValue("name", r.name || "");
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => promptDelete(r.id)}
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
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role to your system. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Role Name
                </label>
                <Input
                  id="name"
                  {...(createForm.register("name") as any)}
                  placeholder="Enter role name"
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
              <Button type="submit">Create Role</Button>
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
        description={`Are you sure you want to delete this role? This action cannot be undone.`}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!showEdit}
        onOpenChange={(open) => !open && setShowEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Make changes to the role. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Role Name
                </label>
                <Input
                  id="edit-name"
                  {...(editForm.register("name") as any)}
                  defaultValue={showEdit?.name}
                  placeholder="Enter role name"
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

      {/* Manage Permissions Dialog */}
      <Dialog
        open={!!showPerms}
        onOpenChange={(open) => !open && setShowPerms(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Assign or remove permissions for this role.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 grid gap-3">
            {permissions.map((p) => (
              <label key={p.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedPerms.includes(p.id)}
                  onChange={() => togglePerm(p.id)}
                />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPerms(null)}
            >
              Cancel
            </Button>
            <Button onClick={savePerms}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
