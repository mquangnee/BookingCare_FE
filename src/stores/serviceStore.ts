import { doGetServices } from "../api/service"
import type { ServiceModel } from "../types/index"

async function getServices() : Promise<ServiceModel[]> {
    return doGetServices()
}

export const useServiceStore = () => ({
    getServices
})