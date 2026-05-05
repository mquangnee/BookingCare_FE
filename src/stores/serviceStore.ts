import { doChangeServiceStatus, doCreateService, doGetServicesAdmin, doGetServicesPatient, doUpdateService } from "../api/service"
import type { ServiceModel, CreateServiceModel, UpdateServiceModel } from "../types/index"

async function getServicesPatient() : Promise<ServiceModel[]> {
    return doGetServicesPatient()
}

async function getServicesAdmin() : Promise<ServiceModel[]> {
    return doGetServicesAdmin()
}

async function createService(payload: CreateServiceModel) : Promise<boolean> {
    return doCreateService(payload)
}

async function updateService(payload: UpdateServiceModel) : Promise<boolean> {
    return doUpdateService(payload)
}

async function changeServiceStatus(serviceId: string) : Promise<boolean> {
    return doChangeServiceStatus(serviceId)
}

export const useServiceStore = () => ({
    getServicesPatient,
    getServicesAdmin,
    createService,
    updateService,
    changeServiceStatus
})