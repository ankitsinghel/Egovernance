"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Download,
} from "lucide-react";
import { context } from "@/context/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserReportCreateSchema, UserReportUpdateSchema } from "@/lib/schemas";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type UserReport = {
  id: number;
  trackingId: string;
  departmentId: number;
  designation: string | null;
  accusedName: string | null;
  description: string;
  files: string | null;
  status: "pending" | "in_progress" | "resolved" | "closed";
  assignedToId: number | null;
  createdAt: string;
};

type ActionLog = {
  id: number;
  action: string;
  description: string | null;
  createdAt: string;
  adminId: number;
  userReportId: number;
};

export default function ComplaintsMaster() {
  const { userReports, refreshUserReports, departments, admins, loading } =
    context();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<UserReport | null>(null);
  const [showDetails, setShowDetails] = useState<UserReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const createForm = useForm({
    resolver: zodResolver(UserReportCreateSchema),
    defaultValues: {
      departmentId: 0,
      designation: "",
      accusedName: "",
      description: "",
      files: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(UserReportUpdateSchema),
    defaultValues: {
      departmentId: 0,
      designation: "",
      accusedName: "",
      description: "",
      files: "",
      status: "pending",
      assignedToId: 0,
    },
  });

  // Memoized filtered data
  const filteredReports = useMemo(() => {
    if (!userReports) return [];

    return userReports.filter((report: UserReport) => {
      const matchesSearch =
        report.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.accusedName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [userReports, searchQuery, statusFilter]);

  // Status badge variant mapping
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "resolved":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Handler functions
  const handleCreate = useCallback(
    async (data: any) => {
      try {
        const res = await fetch("/api/user-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            departmentId: data.departmentId,
            designation: data.designation,
            accusedName: data.accusedName,
            description: data.description,
            files: data.files,
          }),
        });
        const j = await res.json();
        if (j.ok) {
          setShowCreate(false);
          createForm.reset();
          refreshUserReports();
        } else {
          alert(j.error || "Create failed");
        }
      } catch (e) {
        alert("Network error");
      }
    },
    [createForm, refreshUserReports]
  );

  const handleEdit = useCallback(
    async (data: any) => {
      if (!showEdit) return;
      try {
        const res = await fetch(`/api/user-reports/${showEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            departmentId: data.departmentId,
            designation: data.designation,
            accusedName: data.accusedName,
            description: data.description,
            files: data.files,
            status: data.status,
            assignedToId: data.assignedToId || null,
          }),
        });
        const j = await res.json();
        if (j.ok) {
          setShowEdit(null);
          editForm.reset();
          refreshUserReports();
        } else {
          alert(j.error || "Update failed");
        }
      } catch (e) {
        alert("Network error");
      }
    },
    [showEdit, editForm, refreshUserReports]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Delete this complaint?")) return;
      try {
        const res = await fetch(`/api/user-reports/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const j = await res.json();
        if (j.ok) {
          refreshUserReports();
        } else {
          alert("Delete failed");
        }
      } catch (e) {
        alert("Network error");
      }
    },
    [refreshUserReports]
  );

  const handleRefresh = useCallback(async () => {
    await refreshUserReports();
  }, [refreshUserReports]);

  const handleEditClick = useCallback(
    (report: UserReport) => {
      setShowEdit(report);
      editForm.reset({
        departmentId: report.departmentId,
        designation: report.designation || "",
        accusedName: report.accusedName || "",
        description: report.description,
        files: report.files || "",
        status: report.status,
        assignedToId: report.assignedToId || 0,
      });
    },
    [editForm]
  );

  const handleViewDetails = useCallback((report: UserReport) => {
    setShowDetails(report);
  }, []);

  const downloadFile = useCallback((fileUrl: string) => {
    // Implement file download logic
    window.open(fileUrl, "_blank");
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                Complaints Management
              </CardTitle>
              <CardDescription>
                Manage and track user complaints and reports
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
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">New Complaint</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking ID, accused name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tracking ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Accused Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right w-[180px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report: UserReport) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.trackingId}
                      </TableCell>
                      <TableCell>
                        {departments.find(
                          (d: any) => d.id === report.departmentId
                        )?.name || "-"}
                      </TableCell>
                      <TableCell>{report.accusedName || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(report.status)}>
                          {report.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.assignedToId
                          ? admins.find(
                              (a: any) => a.id === report.assignedToId
                            )?.name || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(report)}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="ml-2 hidden sm:inline">View</span>
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
                                onClick={() => handleViewDetails(report)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(report)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {report.files && (
                                <DropdownMenuItem
                                  onClick={() => downloadFile(report.files!)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Files
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(report.id)}
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        {userReports?.length === 0
                          ? "No complaints found."
                          : "No complaints match your search."}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Complaint</DialogTitle>
            <DialogDescription>
              Add a new user complaint to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <Select
                  onValueChange={(value) =>
                    createForm.setValue("departmentId", parseInt(value))
                  }
                  defaultValue={
                    createForm.watch("departmentId")?.toString() || "0"
                  }
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
              <div className="grid gap-2">
                <label htmlFor="designation" className="text-sm font-medium">
                  Designation
                </label>
                <Input
                  id="designation"
                  placeholder="Enter designation"
                  {...createForm.register("designation")}
                />
                {createForm.formState.errors.designation && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.designation as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="accusedName" className="text-sm font-medium">
                  Accused Name
                </label>
                <Input
                  id="accusedName"
                  placeholder="Enter accused person's name"
                  {...createForm.register("accusedName")}
                />
                {createForm.formState.errors.accusedName && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.accusedName as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter complaint description"
                  {...createForm.register("description")}
                />
                {createForm.formState.errors.description && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.description as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="files" className="text-sm font-medium">
                  File URLs (comma separated)
                </label>
                <Input
                  id="files"
                  placeholder="Enter file URLs separated by commas"
                  {...createForm.register("files")}
                />
                {createForm.formState.errors.files && (
                  <p className="text-xs text-destructive">
                    {(createForm.formState.errors.files as any).message}
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
              <Button type="submit">Create Complaint</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!showEdit}
        onOpenChange={(open) => !open && setShowEdit(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Complaint</DialogTitle>
            <DialogDescription>
              Update complaint details and status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="edit-department"
                  className="text-sm font-medium"
                >
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
              <div className="grid gap-2">
                <label
                  htmlFor="edit-designation"
                  className="text-sm font-medium"
                >
                  Designation
                </label>
                <Input
                  id="edit-designation"
                  placeholder="Enter designation"
                  {...editForm.register("designation")}
                />
                {editForm.formState.errors.designation && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.designation as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="edit-accusedName"
                  className="text-sm font-medium"
                >
                  Accused Name
                </label>
                <Input
                  id="edit-accusedName"
                  placeholder="Enter accused person's name"
                  {...editForm.register("accusedName")}
                />
                {editForm.formState.errors.accusedName && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.accusedName as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter complaint description"
                  {...editForm.register("description")}
                />
                {editForm.formState.errors.description && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.description as any).message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-files" className="text-sm font-medium">
                  File URLs
                </label>
                <Input
                  id="edit-files"
                  placeholder="Enter file URLs separated by commas"
                  {...editForm.register("files")}
                />
                {editForm.formState.errors.files && (
                  <p className="text-xs text-destructive">
                    {(editForm.formState.errors.files as any).message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    onValueChange={(value) =>
                      editForm.setValue(
                        "status",
                        value as
                          | "pending"
                          | "in_progress"
                          | "resolved"
                          | "closed"
                      )
                    }
                    defaultValue={showEdit?.status || "pending"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-assignedTo"
                    className="text-sm font-medium"
                  >
                    Assign To
                  </label>
                  <Select
                    onValueChange={(value) =>
                      editForm.setValue(
                        "assignedToId",
                        value === "0" ? 0 : parseInt(value)
                      )
                    }
                    defaultValue={showEdit?.assignedToId?.toString() || "0"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Unassigned</SelectItem>
                      {admins.map((admin: any) => (
                        <SelectItem key={admin.id} value={admin.id.toString()}>
                          {admin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

      {/* Details Dialog */}
      <Dialog
        open={!!showDetails}
        onOpenChange={(open) => !open && setShowDetails(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Complete information about the complaint.
            </DialogDescription>
          </DialogHeader>
          {showDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tracking ID
                  </label>
                  <p className="text-sm">{showDetails.trackingId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(showDetails.status)}>
                      {showDetails.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Department
                  </label>
                  <p className="text-sm">
                    {departments.find(
                      (d: any) => d.id === showDetails.departmentId
                    )?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </label>
                  <p className="text-sm">
                    {showDetails.assignedToId
                      ? admins.find(
                          (a: any) => a.id === showDetails.assignedToId
                        )?.name || "-"
                      : "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Designation
                  </label>
                  <p className="text-sm">{showDetails.designation || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Accused Name
                  </label>
                  <p className="text-sm">{showDetails.accusedName || "-"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {showDetails.description}
                </p>
              </div>
              {showDetails.files && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Files
                  </label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(showDetails.files!)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Files
                    </Button>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created Date
                </label>
                <p className="text-sm">
                  {new Date(showDetails.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDetails(null)}
            >
              Close
            </Button>
            {showDetails && (
              <Button onClick={() => handleEditClick(showDetails)}>
                Edit Complaint
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
