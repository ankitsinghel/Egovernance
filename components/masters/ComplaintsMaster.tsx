"use client";

import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Plus,
  Search,
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
import { UserReportCreateSchema } from "@/lib/schemas";
import type { UserReportCreateForm } from "@/lib/schemas";
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
import ReportDrawer from "@/components/drawers/ReportDrawer";
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
import type { UserReport, Department, Admin } from "@/lib/types";
import { statusKey, statusLabel } from "@/lib/statuses";
import { ButtonGroup } from "../ui/button-group";

export default function ComplaintsMaster() {
  const {
    userReports,
    refreshUserReports,
    departments,
    admins,
    loading,
    setLoading,
  } = context();
  const [showCreate, setShowCreate] = useState(false);
  const [showDetails, setShowDetails] = useState<UserReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  function promptDelete(id: number) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }

  const createForm = useForm<UserReportCreateForm>({
    resolver: zodResolver(UserReportCreateSchema),
    defaultValues: {
      departmentId: 0,
      designation: "",
      accusedName: "",
      description: "",
      files: "",
    },
  });

  const editForm = useForm({});

  // Memoized filtered data
  const filteredReports = useMemo(() => {
    if (!userReports) return [];

    return userReports.filter((report: UserReport) => {
      const matchesSearch =
        report.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.accusedName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || statusKey(report.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [userReports, searchQuery, statusFilter]);

  // Status badge variant mapping
  const getStatusVariant = (statusOrId: string | number) => {
    const key =
      typeof statusOrId === "number"
        ? statusKey(statusOrId)
        : String(statusOrId);
    switch (key) {
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
    async (data: UserReportCreateForm) => {
      try {
        setLoading(true);
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
          if (j.message) toast.success(j.message);
        } else {
          toast.error(j.message || j.error || "Create failed");
        }
      } catch (e: unknown) {
        toast.error((e as Error)?.message || "Network error");
      } finally {
        setLoading(false);
      }
    },
    [createForm, refreshUserReports]
  );

  // edit functionality removed

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user-reports/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const j = await res.json();
        if (j.ok) {
          refreshUserReports();
          if (j.message) toast.success(j.message);
        } else {
          toast.error(j.message || "Delete failed");
        }
      } catch (e: unknown) {
        toast.error((e as Error)?.message || "Network error");
      } finally {
        setLoading(false);
        setShowDeleteDialog(false);
        setDeleteTargetId(null);
      }
    },
    [refreshUserReports]
  );

  const handleRefresh = useCallback(async () => {
    await refreshUserReports();
  }, [refreshUserReports]);

  // edit click removed

  const handleViewDetails = useCallback((report: UserReport) => {
    setShowDetails(report);
  }, []);

  const downloadFile = useCallback((fileUrl: string) => {
    // Implement file download logic
    window.open(fileUrl, "_blank");
  }, []);

  return (
    <div>
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
                  {/* <span className="ml-2 hidden sm:inline">New Complaint</span> */}
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
                          (d: Department) => d.id === report.departmentId
                        )?.name || "-"}
                      </TableCell>
                      <TableCell>{report.accusedName || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(report.status)}>
                          {statusLabel(report.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.assignedToId
                          ? admins.find(
                              (a: Admin) => a.id === report.assignedToId
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
                              {/* Edit removed per project requirements */}
                              {/* {report.files && (
                                <DropdownMenuItem
                                  onClick={() => downloadFile(report.files!)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Files
                                </DropdownMenuItem>
                              )} */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => promptDelete(report.id)}
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
                    {departments.map((d: Department) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.departmentId?.message && (
                  <p className="text-xs text-destructive">
                    {String(createForm.formState.errors.departmentId?.message)}
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
                {createForm.formState.errors.designation?.message && (
                  <p className="text-xs text-destructive">
                    {String(createForm.formState.errors.designation?.message)}
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
                {createForm.formState.errors.accusedName?.message && (
                  <p className="text-xs text-destructive">
                    {String(createForm.formState.errors.accusedName?.message)}
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
                {createForm.formState.errors.description?.message && (
                  <p className="text-xs text-destructive">
                    {String(createForm.formState.errors.description?.message)}
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
                {createForm.formState.errors.files?.message && (
                  <p className="text-xs text-destructive">
                    {String(createForm.formState.errors.files?.message)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this complaint? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteTargetId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteTargetId) await handleDelete(deleteTargetId);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportDrawer
        open={!!showDetails}
        onOpenChange={(open) => {
          if (!open) setShowDetails(null);
        }}
        report={showDetails}
      />
    </div>
  );
}
