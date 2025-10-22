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

  // If consumer provided defaultValue but no value, keep uncontrolled by passing defaultValue.
  if (value === undefined && defaultValue !== undefined) {
    return (
      <input
        ref={ref}
        className={baseClass}
        defaultValue={defaultValue}
        onChange={onChange}
        {...rest}
      />
    );
  }

  // If value is undefined and no defaultValue, render uncontrolled input (don't pass value prop)
  if (value === undefined) {
    return (
      <input ref={ref} className={baseClass} onChange={onChange} {...rest} />
    );
  }

  // Controlled input when value is provided
  return (
    <input
      ref={ref}
      className={baseClass}
      value={normalizeValue(value)}
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

    if (value === undefined && defaultValue !== undefined) {
      return (
        <textarea
          ref={ref}
          className={baseClass}
          defaultValue={defaultValue}
          onChange={onChange}
          {...rest}
        />
      );
    }

    if (value === undefined) {
      return (
        <textarea
          ref={ref}
          className={baseClass}
          onChange={onChange}
          {...rest}
        />
      );
    }

    return (
      <textarea
        ref={ref}
        className={baseClass}
        value={normalizeValue(value)}
        onChange={onChange}
        {...rest}
      />
    );
  }
);

Textarea.displayName = "Textarea";
