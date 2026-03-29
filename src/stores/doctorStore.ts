import { doGetDoctorsBySpecialty } from "../api/doctor"
import type { DoctorModel } from "../api/doctor"

async function getDoctorsBySpecialty(specialtyId: string): Promise<DoctorModel[]> {
    return doGetDoctorsBySpecialty(specialtyId)
}

export const useDoctorStore = () => ({
    getDoctorsBySpecialty
})