import { doGetDoctorsByService, doGetDoctorsBySpecialty } from "../api/doctor"
import type { DoctorModel, ServiceModel } from "../types/index"

async function getDoctorsBySpecialty(specialtyId: string): Promise<DoctorModel[]> {
    return doGetDoctorsBySpecialty(specialtyId)
}

async function getDoctorsByService(serviceId: string): Promise<ServiceModel> {
    return doGetDoctorsByService(serviceId)
}

export const useDoctorStore = () => ({
    getDoctorsBySpecialty,
    getDoctorsByService
})