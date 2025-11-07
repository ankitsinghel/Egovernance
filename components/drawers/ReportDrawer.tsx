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
  ActionLog,
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: UserReportDetailT | null;
}

export default function ReportDrawer({ open, onOpenChange, report }: Props) {
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
    form.setValue("description", "");
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
      <SheetContent side="right" className="w-full lg:w-1/3 overflow-auto">
        <SheetHeader>
          <SheetTitle>Report {report?.trackingId}</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Department</div>
              <div className="font-medium">
                {report?.department?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge>
                  {report
                    ? statusLabel(report.status ?? defaultStatusId())
                    : "-"}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="mt-1 whitespace-pre-wrap">
              {report?.description}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Actions</h4>
            </div>

            <div className="space-y-3 mt-2 overflow-auto max-h-[40vh] pr-2">
              {actions.length === 0 && (
                <div className="text-sm">No actions yet.</div>
              )}
              {actions.map((a: ActionForDrawerT) => (
                <div key={a.id} className="p-2 border rounded-md">
                  <div className="text-sm text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div className="font-medium">
                    {a.statusChange !== null && a.statusChange !== undefined
                      ? statusLabel(a.statusChange)
                      : "-"}
                  </div>
                  <div className="text-sm">{a.note}</div>
                  {a.proofFile && (
                    <div className="mt-2">
                      <a
                        href={a.proofFile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {showAdd ? (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setShowAdd(!showAdd)}
              >
                <Cross1Icon />
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setShowAdd(!showAdd)}
              >
                Add Action
              </Button>
            )}
            {/* Add Action form appears when user clicks the Add Action button */}
            {showAdd && (
              <div className="mt-4">
                <h4 className="font-semibold">Add Action</h4>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-2 space-y-2"
                  >
                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. in_progress" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              defaultValue={String(
                                field.value ?? defaultStatusId()
                              )}
                            >
                              <SelectTrigger>
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <label className="text-sm">Attachment</label>
                      <Input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFile(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Action"}
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowAdd(false)}
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

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
