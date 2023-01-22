import { ServicesDTOInterface } from "../../leader-election.service/interfaces/leader-election.interfaces";

export interface CheckHealthInterface {
  status: string;
  components: object;
}

export interface HealthFetchResultInterface {
  fetchResult: CheckHealthInterface;
  service: ServicesDTOInterface;
}
