import { Logger } from "pino";
import { Registry } from "prom-client";
declare global {
  var logger: Logger | undefined;
  var metrics:
    | {
        registry: Registry;
      }
    | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;
    const lokiTransport = pinoLoki({
      host: "http://localhost:3100",
      batching: true,
      interval: 5,
      labels: { app: "satark" },
    });
    const logger = pino(
      // {level: process.env.LOG_LEVEL || "info",},
      lokiTransport
    );
    globalThis.logger = logger;
  }
}
