import { doGetServices } from "../api/service"
import type { ServiceModel } from "../api/service";

async function getServices() : Promise<ServiceModel[]> {
    return doGetServices()
}

export const useServiceStore = () => ({
    getServices
})