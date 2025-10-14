"use client";

import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input, Textarea } from "../../components/ui/input";
import { ReportSchema, ReportForm } from "../../lib/schemas";

export default function ReportPage() {
  const form = useForm<ReportForm>({ resolver: zodResolver(ReportSchema) });
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: ReportForm, event?: any) {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("organization", data.organization);
      if (data.designation) body.append("designation", data.designation);
      if (data.accusedName) body.append("accusedName", data.accusedName);
      if (data.city) body.append("city", data.city);
      body.append("description", data.description);
      const files = event?.target?.file?.files;
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) body.append("file", files[i]);
      }
      const res = await fetch("/api/report", { method: "POST", body });
      const j = await res.json();
      if (j.ok) alert("Report submitted. Tracking ID: " + j.trackingId);
      else alert("Submit failed");
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Anonymous Report Form</h2>
      <div className="mt-4">
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="organization"
              render={({ field, fieldState }: any) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState?.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field, fieldState }: any) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState?.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accusedName"
              render={({ field, fieldState }: any) => (
                <FormItem>
                  <FormLabel>Name of accused (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState?.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }: any) => (
                <FormItem>
                  <FormLabel>City (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState?.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }: any) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage>{fieldState?.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm">Evidence (photo/video/pdf)</label>
              <input type="file" name="file" multiple className="w-full mt-1" />
            </div>

            <Button
              type="submit"
              className="bg-[var(--primary)] cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
