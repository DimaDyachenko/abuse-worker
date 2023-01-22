import { send } from "../../lib/fetch/fetch.client";
import { ServicesDTOInterface } from "../leader-election.service/interfaces/leader-election.interfaces";
import {
  CheckHealthInterface,
  HealthFetchResultInterface,
} from "./interfaces/health.interface";

export async function healthCheck<T>(
  services: ServicesDTOInterface[]
): Promise<HealthFetchResultInterface[]> {
  try {
    const fetchHealthChecks = services.map(async (service) => {
      const fetchResult = await send<CheckHealthInterface>(service.host, {
        method: "GET",
      });

      return {
        fetchResult: fetchResult,
        service: service,
      };
    });

    const healthChecksPromisesList = await Promise.allSettled(
      fetchHealthChecks
    );

    return (
      healthChecksPromisesList
        .filter((promise) => promise.status === "fulfilled")
        // @ts-ignore
        .map((service) => service.value)
    );
  } catch (error) {
    throw (error as Error).message;
  }
}
