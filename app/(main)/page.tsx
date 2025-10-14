import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-6 md:grid-cols-2 items-start">
      <Card>
        <h1 className="text-2xl font-bold">Report corruption anonymously</h1>
        <p className="mt-3 text-sm text-slate-600">
          Submit evidence and get a secure tracking ID to monitor progress.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/report">
            <Button>Report Now</Button>
          </Link>
          <Link href="/track">
            <Button className="bg-white text-slate-700">Track</Button>
          </Link>
          <Link href="/admin/login">
            <Button className="bg-slate-800 text-white">Admin Sign in</Button>
          </Link>
          <Link href="/admin/signup">
            <Button className="bg-slate-200 text-slate-800">
              Admin Sign up
            </Button>
          </Link>
          <Link href="/super-admin/login">
            <Button className="bg-yellow-600 text-white">
              SuperAdmin Sign in
            </Button>
          </Link>
          <Link href="/super-admin/signup">
            <Button className="bg-yellow-200 text-yellow-800">
              SuperAdmin Sign up
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 text-sm text-slate-600 list-decimal list-inside">
          <li>Fill the anonymous form and attach evidence.</li>
          <li>Get a tracking ID (SHA256) to follow progress.</li>
          <li>
            Case gets assigned and escalated automatically based on rules.
          </li>
        </ol>
      </Card>
    </section>
  );
}
