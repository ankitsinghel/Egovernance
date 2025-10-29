"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { context } from "@/context/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCreateSchema, AdminUpdateSchema } from "@/lib/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Admin, AnyT, StateT } from "@/lib/types";
import Pagination from "@/components/ui/pagination";

export default function StateAdminsMaster() {
  const { admins, setAdmins, refreshAdmins, states, loading, setLoading, user } =
    context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  function promptDelete(id: number) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }

  const createForm = useForm({
    resolver: zodResolver(AdminCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: user?.departmentId || 0,
      stateId: 0,
    },
  });
  const editForm = useForm<any>({
    resolver: zodResolver(AdminUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: user?.departmentId || 0,
      stateId: 0,
    },
  });

  useEffect(() => {
    if (user?.departmentId) {
      createForm.setValue("departmentId", user.departmentId as number);
      editForm.setValue("departmentId", user.departmentId as number);
    }
  }, [user]);

  const { stateAdmins, filteredAdmins } = useMemo(() => {
    const list = (admins || []).filter((a: any) => {
      const r = a.role;
      return (
        r === 3 ||
        r === "3" ||
        (typeof r === "string" && r.toLowerCase().includes("state"))
      );
    });

    const filtered = list.filter(
      (admin: Admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { stateAdmins: list, filteredAdmins: filtered };
  }, [admins, searchQuery]);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / perPage));
  const paged = filteredAdmins.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => setPage(1), [searchQuery]);

  const handleCreate = useCallback(
    async (data: AnyT) => {
      try {
        setLoading(true);
        if (!user?.departmentId) {
          toast.error("Current user's department is not set");
          return;
        }
        const res = await fetch("/api/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            departmentId: user.departmentId,
            role: 3,
            stateId: data.stateId || null,
            superiorId: Number(user.id),
          }),
        });
        const j = await res.json();
        if (j.ok) {
          setShowCreate(false);
          createForm.reset();
          setAdmins(([...admins, j.admin]));
          if (j.message) toast.success(j.message);
        } else {
          toast.error(j.message || j.error || "Create failed");
        }
      } catch (e) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    },
    [createForm, refreshAdmins, user]
  );

  const handleEdit = useCallback(
    async (data: AnyT) => {
      if (!showEdit) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admins/${showEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            stateId: data.stateId || null,
          }),
        });
        const j = await res.json();
        if (j.ok) {
          setShowEdit(null);
          editForm.reset();
          setAdmins(admins.map(a=>a.id===showEdit.id?j.admin:a));
          if (j.message) toast.success(j.message);
        } else {
          toast.error(j.message || j.error || "Update failed");
        }
      } catch (e) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    },
    [showEdit, editForm, refreshAdmins]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admins/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const j = await res.json();
        if (j.ok) {
          setAdmins(admins.filter((a) => a.id !== id));
          setShowDeleteDialog(false);
          setDeleteTargetId(null);
          if (j.message) toast.success(j.message);
        } else {
          toast.error(j.message || "Delete failed");
        }
      } catch (e) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    },
    [refreshAdmins]
  );

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await refreshAdmins();
    } finally {
      setLoading(false);
    }
  }, [refreshAdmins]);

  const handleEditClick = useCallback(
    (admin: Admin) => {
      setShowEdit(admin);
      editForm.reset({
        name: admin.name,
        email: admin.email,
        password: "",
        departmentId: admin.departmentId || user?.departmentId || 0,
      });
      // set state if available
      if ((admin as any).stateId)
        editForm.setValue("stateId", (admin as any).stateId);
    },
    [editForm, user]
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">State Admins</CardTitle>
              <CardDescription>
                Manage state-level administrators
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
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
                placeholder="Search state admins by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right w-[150px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length > 0 ? (
                  paged.map((admin: Admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.id}</TableCell>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell className="lowercase">{admin.email}</TableCell>
                      <TableCell>
                        {states.find(
                          (s: StateT) => s.id === (admin as any).stateId
                        )?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(admin)}
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
                                onClick={() => handleEditClick(admin)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => promptDelete(admin.id)}
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        {stateAdmins.length === 0
                          ? "No state admins found."
                          : "No admins match your search."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </CardContent>
      </Card>

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
        description={`Are you sure you want to delete this admin? This action cannot be undone.`}
      />

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New State Admin</DialogTitle>
            <DialogDescription>
              Add a new state administrator to your system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter admin name"
                  {...createForm.register("name" as any)}
                />
                {createForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.name as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...createForm.register("email" as any)}
                />
                {createForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.email as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...createForm.register("password" as any)}
                />
                {createForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.password as any).message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Select
                  onValueChange={(value) =>
                    createForm.setValue("stateId", parseInt(value))
                  }
                  defaultValue={createForm.watch("stateId")?.toString() || "0"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select State</SelectItem>
                    {states.map((s: StateT) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.stateId && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.stateId as any).message}
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
              <Button type="submit">Create Admin</Button>
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
            <DialogTitle>Edit State Admin</DialogTitle>
            <DialogDescription>
              Make changes to the administrator account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-name"
                  placeholder="Enter admin name"
                  {...editForm.register("name" as any)}
                  defaultValue={showEdit?.name}
                />
                {editForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.name as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email address"
                  {...editForm.register("email" as any)}
                  defaultValue={showEdit?.email}
                />
                {editForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.email as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  {...editForm.register("password" as any)}
                />
                {editForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.password as any).message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-state" className="text-sm font-medium">
                  State
                </label>
                <Select
                  onValueChange={(value) =>
                    editForm.setValue("stateId", parseInt(value))
                  }
                  defaultValue={
                    (
                      (showEdit as any)?.stateId || editForm.watch("stateId")
                    )?.toString() || "0"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select State</SelectItem>
                    {states.map((s: StateT) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
