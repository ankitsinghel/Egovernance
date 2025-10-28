"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  setPage: (n: number) => void;
  totalPages: number;
};

function range(start: number, end: number) {
  const out = [] as number[];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export const Pagination = ({ page, setPage, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  let pages: number[] = [];
  if (totalPages <= 7) {
    pages = range(1, totalPages);
  } else {
    if (page <= 4) pages = [...range(1, 5), -1, totalPages];
    else if (page >= totalPages - 3)
      pages = [1, -1, ...range(totalPages - 4, totalPages)];
    else pages = [1, -1, ...range(page - 1, page + 1), -1, totalPages];
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === -1 ? (
              <span
                key={`e-${i}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "ghost"}
                onClick={() => setPage(p)}
                className={cn(
                  "w-9 h-9 p-0 text-sm",
                  p === page ? "font-medium" : ""
                )}
              >
                {p}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
