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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { context } from "../../context/context";
import { ReportSchema, ReportForm } from "../../lib/schemas";
import {
  Shield,
  Upload,
  Building,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  Eye,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Label } from "../../components/ui/label";

export default function ReportPage() {
  const { departments, states } = context();
  const form = useForm<ReportForm>({ resolver: zodResolver(ReportSchema) });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  async function onSubmit(data: ReportForm, event?: any) {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("department", String(data.department));
      if (data.state) body.append("state", String(data.state));
      if (data.designation) body.append("designation", data.designation);
      if (data.accusedName) body.append("accusedName", data.accusedName);
      // if (data.state) body.append("city", data.city);
      body.append("description", data.description);

      if (files && files.length) {
        for (let i = 0; i < files.length; i++) body.append("file", files[i]);
      }

      const res = await fetch("/api/report", { method: "POST", body });
      const j = await res.json();
      if (j.ok) {
        setTrackingId(j.trackingId);
        setSubmitted(true);
      } else {
        alert("Submit failed: " + (j.error || "Unknown error"));
      }
    } catch (e) {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Report Submitted
            </h1>
            <p className="text-slate-600">
              Your report has been submitted anonymously
            </p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">
                Your Secure Tracking ID
              </h3>
              <div className="font-mono text-lg font-bold text-green-900 bg-green-100 px-4 py-2 rounded-lg">
                {trackingId}
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 text-left">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>
                  Use this tracking ID to monitor your report's progress
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Your identity remains completely anonymous</span>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>All evidence is encrypted and secure</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={() =>
                  (window.location.href = `/track?tid=${trackingId}`)
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Track Your Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setTrackingId("");
                  form.reset();
                  setFiles(null);
                }}
                className="w-full"
              >
                Submit Another Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Eye className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Anonymous Report
          </h1>
          <p className="text-slate-600">
            Report corruption safely and securely. Your identity is protected.
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Lock className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Complete Anonymity • End-to-End Encryption • No Tracking
          </span>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field, fieldState }: any) => {

                  return (
                    <FormItem>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Building className="w-4 h-4" />
                        <FormLabel>Department *</FormLabel>
                      </div>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                          defaultValue={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((d: any) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{fieldState?.error?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />

              {/* Designation Field */}
              <FormField
                control={form.control}
                name="designation"
                render={({ field, fieldState }: any) => (
                  <FormItem>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <User className="w-4 h-4" />
                      <FormLabel>Your Designation (Optional)</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your position or role"
                        className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Accused Name Field */}
              <FormField
                control={form.control}
                name="accusedName"
                render={({ field, fieldState }: any) => (
                  <FormItem>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <FormLabel>Name of Accused (Optional)</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Person involved in the incident"
                        className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* State Field */}
              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }: any) => {
                  const { states } = context();
                  return (
                    <FormItem>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        <FormLabel>State (Optional)</FormLabel>
                      </div>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                          defaultValue={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((s: any) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{fieldState?.error?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }: any) => (
                  <FormItem>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <FormLabel>Incident Description *</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Provide detailed information about the corruption or unethical practice..."
                        className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                          fieldState?.error
                            ? "border-red-300 ring-2 ring-red-100"
                            : "border-slate-300"
                        }`}
                      />
                    </FormControl>
                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Evidence Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Upload className="w-4 h-4" />
                  <Label>Evidence (Optional)</Label>
                </div>
                <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4,.avi,.mov"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block w-full"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">
                      Click to upload evidence
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Photos, Videos, Documents (PDF, DOC) - Max 10MB per file
                    </p>
                  </label>
                </div>
                {files && files.length > 0 && (
                  <div className="w-full bg-slate-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Selected files ({files.length}):
                    </p>
                    <div className="space-y-1">
                      {Array.from(files).map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <FileText className="w-3 h-3" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Security Reminder */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Your Security is Protected</p>
                    <p className="mt-1">
                      All information is encrypted and your identity remains
                      anonymous. No personal data is stored.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Anonymously...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Secure Report
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Supported Formats */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Supported Evidence Formats
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Images (JPG, PNG)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Documents (PDF, DOC)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Videos (MP4, AVI)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Audio Files
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
