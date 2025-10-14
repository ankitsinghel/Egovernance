"use client";
import React from "react";

// Normalize value to avoid uncontrolled -> controlled warnings from React.
function normalizeValue(value: any) {
  if (value === undefined || value === null) return "";
  return value;
}

export function Input(props: any) {
  const { value, defaultValue, onChange, ...rest } = props;
  // If consumer provided defaultValue but no value, keep uncontrolled by passing defaultValue.
  if (value === undefined && defaultValue !== undefined) {
    return (
      <input
        className="w-full p-2 border rounded"
        defaultValue={defaultValue}
        onChange={onChange}
        {...rest}
      />
    );
  }
  return (
    <input
      className="w-full p-2 border rounded"
      value={normalizeValue(value)}
      onChange={onChange}
      {...rest}
    />
  );
}

export function Textarea(props: any) {
  const { value, defaultValue, onChange, ...rest } = props;
  if (value === undefined && defaultValue !== undefined) {
    return (
      <textarea
        className="w-full p-2 border rounded"
        defaultValue={defaultValue}
        onChange={onChange}
        {...rest}
      />
    );
  }
  return (
    <textarea
      className="w-full p-2 border rounded"
      value={normalizeValue(value)}
      onChange={onChange}
      {...rest}
    />
  );
}
