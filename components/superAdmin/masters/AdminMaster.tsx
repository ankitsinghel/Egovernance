

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { RefreshCw, Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
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

type Admin = {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  city: string | null;
};

export default function AdminsMaster() {
  const { admins, refreshAdmins, departments, loading } = context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const createForm = useForm({
    resolver: zodResolver(AdminCreateSchema),
    defaultValues: { name: "", email: "", password: "", departmentId: 0 },
  });
  const editForm = useForm({
    resolver: zodResolver(AdminUpdateSchema),
    defaultValues: { name: "", email: "", password: "", departmentId: 0 },
  });

  // Memoized filtered data to prevent unnecessary re-renders
  const { centralAdmins, filteredAdmins } = useMemo(() => {
    const centralAdmins = (admins || []).filter(
      (a: any) => a.city === null || a.city === undefined
    );
    
    const filteredAdmins = centralAdmins.filter((admin: Admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { centralAdmins, filteredAdmins };
  }, [admins, searchQuery]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleCreate = useCallback(async (data: any) => {
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          departmentId: data.departmentId,
        }),
      });
      const j = await res.json();
      if (j.ok) {
        setShowCreate(false);
        createForm.reset();
        refreshAdmins();
      } else {
        alert(j.error || "Create failed");
      }
    } catch (e) {
      alert("Network error");
    }
  }, [createForm, refreshAdmins]);

  const handleEdit = useCallback(async (data: any) => {
    if (!showEdit) return;
    try {
      const res = await fetch(`/api/admins/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          departmentId: data.departmentId,
        }),
      });
      const j = await res.json();
      if (j.ok) {
        setShowEdit(null);
        editForm.reset();
        refreshAdmins();
      } else {
        alert(j.error || "Update failed");
      }
    } catch (e) {
      alert("Network error");
    }
  }, [showEdit, editForm, refreshAdmins]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this admin?")) return;
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        refreshAdmins();
      } else {
        alert("Delete failed");
      }
    } catch (e) {
      alert("Network error");
    }
  }, [refreshAdmins]);

  const handleRefresh = useCallback(async () => {
    await refreshAdmins();
  }, [refreshAdmins]);

  const handleEditClick = useCallback((admin: Admin) => {
    setShowEdit(admin);
    editForm.reset({
      name: admin.name,
      email: admin.email,
      password: "",
      departmentId: admin.departmentId || 0,
    });
  }, [editForm]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Central Admins</CardTitle>
              <CardDescription>
                Manage central administrators and their permissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowCreate(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Add Admin</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admins by name or email..."
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
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin: Admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.id}</TableCell>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell className="lowercase">{admin.email}</TableCell>
                      <TableCell>
                        {departments.find((d: any) => d.id === admin.departmentId)?.name || "-"}
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
                              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
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
                                onClick={() => handleDelete(admin.id)}
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
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center"
                    >
                      <div className="text-muted-foreground">
                        {centralAdmins.length === 0 ? "No central admins found." : "No admins match your search."}
                      </div>
                    </TableCell>
                  </TableRow>
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
            <DialogTitle>Create New Central Admin</DialogTitle>
            <DialogDescription>
              Add a new central administrator to your system.
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
                  {...createForm.register("name")}
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
                  {...createForm.register("email")}
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
                  {...createForm.register("password")}
                />
                {createForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.password as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <Select
                  onValueChange={(value) => 
                    createForm.setValue("departmentId", parseInt(value))
                  }
                  defaultValue={createForm.watch("departmentId")?.toString() || "0"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select Department</SelectItem>
                    {departments.map((d: any) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.departmentId && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.departmentId as any).message}
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
      <Dialog open={!!showEdit} onOpenChange={(open) => !open && setShowEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
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
                  {...editForm.register("name")}
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
                  {...editForm.register("email")}
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
                  {...editForm.register("password")}
                />
                {editForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.password as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-department" className="text-sm font-medium">
                  Department
                </label>
                <Select
                  onValueChange={(value) => 
                    editForm.setValue("departmentId", parseInt(value))
                  }
                  defaultValue={showEdit?.departmentId?.toString() || "0"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select Department</SelectItem>
                    {departments.map((d: any) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.departmentId && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.departmentId as any).message}
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