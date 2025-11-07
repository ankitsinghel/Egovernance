"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ActionForDrawerT,
  Department,
  ReportFiles,
  UserReportDetailT,
} from "@/lib/types";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionLogCreateSchema, ActionLogCreateForm } from "@/lib/schemas";
import { Cross1Icon } from "@radix-ui/react-icons";
import { STATUSES, defaultStatusId, statusLabel } from "@/lib/statuses";
import { Download, File, Loader2Icon, PaperclipIcon, PlusIcon } from "lucide-react";
import { context } from "@/context/context";
import MediaDialog from "../MediaDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: UserReportDetailT | null;
}

export default function ReportDrawer({ open, onOpenChange, report }: Props) {
  const { departments } = context();
  const [actions, setActions] = useState<ActionForDrawerT[]>(
    (report?.actions as unknown as ActionForDrawerT[]) || []
  );
  const [file, setFile] = useState<File | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setActions((report?.actions as unknown as ActionForDrawerT[]) || []);
  }, [report]);

  const form = useForm<ActionLogCreateForm>({
    resolver: zodResolver(ActionLogCreateSchema),
    defaultValues: {
      action: "",
      description: null,
      userReportId: report?.id ?? 0,
      status: report?.status ?? defaultStatusId(),
    },
  });

  useEffect(() => {
    if (report) {
      form.setValue("userReportId", report.id);
      form.setValue("status", report.status ?? defaultStatusId());
    }
    // reset action/description when report changes
    form.setValue("action", "");
    form.setValue("description", null);
    setFile(null);
  }, [report]);

  async function onSubmit(values: ActionLogCreateForm) {
    if (!report) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("trackingId", report.trackingId);
      fd.append("action", values.action);
      if (values.description)
        fd.append("description", String(values.description));
      if (file) fd.append("file", file);
      fd.append("statusChange", String(values.status));

      const res = await fetch("/api/admin/reports/actions", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setActions((s) => [j.action, ...s]);
        form.reset();
        setFile(null);
        toast.success("Action added");
      } else {
        toast.error(j.message || "Failed to add action");
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full lg:w-1/3 overflow-auto p-0">
        <div className="sticky top-0 bg-background border-b z-10">
          <SheetHeader className="px-6 py-4">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-xl">Report Details</SheetTitle>
              {report?.trackingId && (
                <Badge variant="outline" className="font-mono text-xs">
                  {report.trackingId}
                </Badge>
              )}
            </div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Department
              </div>
              <div className="font-semibold">
                {report?.departmentId ? (
                  departments.find(
                    (d: Department) => d.id === report.departmentId
                  )?.name || <span className="text-muted-foreground">-</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <div>
                <Badge
                  variant={report?.status === 1 ? "default" : "outline"}
                  className={`
                ${
                  report?.status === 3
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : ""
                }
                ${
                  report?.status === 2
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : ""
                }
                ${
                  report?.status === 1
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : ""
                }
              `}
                >
                  {report
                    ? statusLabel(report.status ?? defaultStatusId())
                    : "-"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="p-4 bg-muted/30 rounded-lg min-h-[80px]">
              {report?.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No description provided
                </p>
              )}
            </div>
          </div>
          {/* files section */}
          {/* Files Section - Compact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Files ({report?.files?.length || 0})
              </h4>
            </div>

            {report?.files && report.files.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {report.files.map((file: ReportFiles) => (
                  <MediaDialog
                    key={file.id}
                    src={`${report.trackingId}/reportFiles/${file.name}`}
                    alt={`Preview of ${file.name}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-auto py-2 px-3"
                    >
                      <File className="h-4 w-4 flex-shrink-0" />
                      <span className="max-w-[120px] truncate text-xs">
                        {file.name}
                      </span>
                      <Download className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </MediaDialog>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-2">
                No files attached
              </p>
            )}
          </div>
          {/* Actions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Actions</h3>
              <Button
                size="sm"
                variant={showAdd ? "outline" : "default"}
                onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-2"
              >
                {showAdd ? (
                  <>
                    <Cross1Icon className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Add Action
                  </>
                )}
              </Button>
            </div>

            {/* Actions List */}
            <div className="space-y-3 max-h-[40vh] overflow-auto pr-2">
              {actions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <div className="text-muted-foreground text-sm">
                    No actions recorded yet
                  </div>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setShowAdd(true)}
                  >
                    Add the first action
                  </Button>
                </div>
              ) : (
                actions.map((a: ActionForDrawerT) => (
                  <div
                    key={a.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {a.statusChange !== null && a.statusChange !== undefined
                          ? statusLabel(a.statusChange)
                          : "Note"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {a.note && <p className="text-sm mb-3">{a.note}</p>}

                    {a.proofFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <PaperclipIcon className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={a.proofFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Action Form */}
            {showAdd && (
              <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/50">
                <h4 className="font-semibold mb-4 text-blue-900">
                  Add New Action
                </h4>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(v) => field.onChange(Number(v))}
                                defaultValue={String(
                                  field.value ?? defaultStatusId()
                                )}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUSES.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="action"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Action Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Investigation, Repair..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add details about this action..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attachment</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Input
                          type="file"
                          className="hidden"
                          id="file-upload"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFile(e.target.files?.[0] ?? null)
                          }
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          {file
                            ? file.name
                            : "Click to upload a file or drag and drop"}
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? (
                          <>
                            <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                            Adding...
                          </>
                        ) : (
                          "Add Action"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setShowAdd(false);
                          setFile(null);
                          form.reset();
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
