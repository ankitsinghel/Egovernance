import client from "prom-client";

// Ensure registry is created only once
if (!globalThis.promRegistry) {
  globalThis.promRegistry = new client.Registry();
  client.collectDefaultMetrics({ register: globalThis.promRegistry });
}

// Return existing registry
const registry: client.Registry = globalThis.promRegistry;

// Create or return existing metrics
function getOrCreateMetric(name, factory) {
  if (registry.getSingleMetric(name)) {
    return registry.getSingleMetric(name);
  }
  const metric = factory();
  registry.registerMetric(metric);
  return metric;
}

export const excTime = getOrCreateMetric("execution_time_histogram", () =>
  new client.Histogram({
    name: "execution_time_histogram",
    help: "Histogram for execution time",
    labelNames: ["method", "route", "code"],
    buckets: [1, 10, 20, 100, 200, 500, 1000, 2000, 4000],
  })
);

export const reqCounter = getOrCreateMetric("request_counter", () =>
  new client.Counter({
    name: "request_counter",
    help: "Counter for total requests",
    labelNames: ["method", "route", "code"],
  })
);

export const totalReports = getOrCreateMetric("total_reports_gauge", () =>
  new client.Gauge({
    name: "total_reports_gauge",
    help: "Gauge for number of reports",
    labelNames: ["method", "route", "code"],
  })
);

// Export registry for /metrics endpoint
export { registry };
