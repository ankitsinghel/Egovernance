import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/report">Report an Issue</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
