import { doGetDoctorsBySpecialty } from "../api/doctor"
import type { DoctorModel } from "../types/index"

async function getDoctorsBySpecialty(specialtyId: string): Promise<DoctorModel[]> {
    return doGetDoctorsBySpecialty(specialtyId)
}

export const useDoctorStore = () => ({
    getDoctorsBySpecialty
})