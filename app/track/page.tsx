import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function TrackPage() {
  return (
    <Card>
      <h2 className="text-xl font-semibold">Track Report</h2>
      <form action="/api/report/track" method="get" className="mt-4 flex gap-2">
        <input
          name="trackingId"
          placeholder="Enter tracking ID"
          className="flex-1 p-2 border rounded"
        />
        <Button type="submit">Lookup</Button>
      </form>
    </Card>
  );
}
