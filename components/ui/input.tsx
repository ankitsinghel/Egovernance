"use client";
import React from "react";

// Normalize value to avoid uncontrolled -> controlled warnings from React.
function normalizeValue(value: any) {
  if (value === undefined || value === null) return "";
  return value;
}

export const Input = React.forwardRef<HTMLInputElement, any>(function Input(
  props,
  ref
) {
  const { value, defaultValue, onChange, className, ...rest } = props;

  const baseClass = className || "w-full p-2 border rounded";
  // Always render as a controlled input to avoid switching between uncontrolled and controlled.
  const effective = value !== undefined ? value : defaultValue;

  return (
    <input
      ref={ref}
      className={baseClass}
      value={normalizeValue(effective)}
      onChange={onChange}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  function Textarea(props, ref) {
    const { value, defaultValue, onChange, className, ...rest } = props;
    const baseClass = className || "w-full p-2 border rounded";
    const effective = value !== undefined ? value : defaultValue;

    return (
      <textarea
        ref={ref}
        className={baseClass}
        value={normalizeValue(effective)}
        onChange={onChange}
        {...rest}
      />
    );
  }
);

Textarea.displayName = "Textarea";
