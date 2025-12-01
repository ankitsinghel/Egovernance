import client from "prom-client";

const register = client.register;

  client.collectDefaultMetrics({
    register,
  });

export { client, register };
