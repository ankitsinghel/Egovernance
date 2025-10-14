import React from "react";
import { Spinner } from "../../components/loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={8} />
    </div>
  );
}
