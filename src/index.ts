import {
  ExecutionContext,
  ScheduledController,
} from "@cloudflare/workers-types";
import { leaderElectionService } from "./services/leader-election.service/leader-election.service";
import { ServicesDTOInterface } from "./services/leader-election.service/interfaces/leader-election.interfaces";

export default {
  async scheduled(
    event: ScheduledController,
    env: unknown,
    ctx: ExecutionContext
  ): Promise<void> {
    const servicesUrls: ServicesDTOInterface[] = [
      {
        host: "https://dev-crm.qp-internal.cloud/landing-backend/api/health/status",
        id: "Nikita",
      },
      {
        host: "https://dev-crm.qp-internal.cloud/api/v1/health",
        id: "Dima",
      },
    ];

    await leaderElectionService(servicesUrls);
  },
};
