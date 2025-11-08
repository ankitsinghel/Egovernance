import Link from "next/link";
import { Button } from "../ui/button";

export default function BottomCTA() {
  return (
    <section className="py-12 px-4 bg-slate-900 text-white rounded-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-slate-300 mb-6">
          Join thousands of citizens fighting corruption safely and effectively.
        </p>
        <Link href="/report">
          <Button className="bg-white text-slate-900 hover:bg-slate-100 text-lg py-3 px-8">
            Report Corruption Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
