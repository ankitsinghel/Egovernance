import { Logger } from "pino";
import { Registry } from "prom-client";
declare global {
  var logger: Logger | undefined;
  var metrics:
    | {
        registry: Registry;
      }
    | undefined;
  var promRegistry: Registry | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;
    const lokiTransport = pinoLoki({
     // host: "http://localhost:3100", //for machine localhost
       host: "http://loki:3100", //for docker container localhost
      batching: true,
      interval: 5,
      labels: { app: "satark" },
    });
    const logger = pino(
      // {level: process.env.LOG_LEVEL || "info",},
      lokiTransport
    );

    globalThis.logger = logger;

//     const Registry = (await import("prom-client")).Registry;
//  const client = (await import("prom-client")).default;
//     if (!globalThis.promRegistry) {
//       const registry = new Registry();
//       client.collectDefaultMetrics({ register: registry });
//       globalThis.promRegistry = registry;
      // console.log("✅ Prometheus registry initialized");
    //}
  }
}
