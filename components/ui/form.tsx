"use client";
import React from "react";
import { Control, useController } from "react-hook-form";

type FormProps = React.PropsWithChildren<any> & { [k: string]: any };

export function Form(props: FormProps) {
  // Expecting spread of useForm return (control, handleSubmit, etc.)
  return <div {...props}>{props.children}</div>;
}

export function FormField({
  control,
  name,
  render,
}: {
  control: Control<any>;
  name: string;
  render: (args: any) => React.ReactNode;
}) {
  const { field, fieldState } = useController({ name, control });
  return <>{render({ field, fieldState })}</>;
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  return <p className="text-xs text-red-600 mt-1">{children}</p>;
}

export default Form;
