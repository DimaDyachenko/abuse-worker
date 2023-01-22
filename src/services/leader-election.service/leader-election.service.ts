import { healthCheck } from "../health.service/health.service";
import { ServicesDTOInterface } from "./interfaces/leader-election.interfaces";
import { send } from "../../lib/fetch/fetch.client";
import { SendRequestDurationInterface } from "../../lib/fetch/interfaces/fetch.client.interfaces";
import { HealthFetchResultInterface } from "../health.service/interfaces/health.interface";
import { logger } from "../../lib/logger/logger";

export async function leaderElectionService(
  services: ServicesDTOInterface[]
): Promise<void> {
  try {
    const servicesHealth = await healthCheck<HealthFetchResultInterface[]>(
      services
    );

    if (!servicesHealth.length) {
      // await logger(`Both services are unavailable`, "ERROR");
      const errorMessage = `All services are down`;
      return Promise.reject(errorMessage);
    } else if (servicesHealth.length === 1) {
      const { service } = servicesHealth[0];

      // await logger(`Leader is ${service.host}`, "INFO");
      await send(`${service.host}`, { method: "POST" });
    } else {
      const requestDurationInfoPromises = servicesHealth.map(
        async (service: HealthFetchResultInterface) => {
          const {
            service: { host },
          } = service;
          return await send<SendRequestDurationInterface>(host, {
            method: "GET",
            requestDuration: true,
          });
        }
      );
      const listOfRequestsDurations = await Promise.all(
        requestDurationInfoPromises
      );
      const leader = listOfRequestsDurations.sort()[0];
      // await logger(`Leader is ${leader.host}`, "INFO");
      await send(leader.url, { method: "POST" });
    }
  } catch (error) {
    // await logger(`${(error as Error).message}`, "ERROR");
    throw (error as Error).message;
  }
}
