import { doGetSpecialties } from "../api/specialty"
import type { SpecialtyModel } from "../types/index"

async function getSpecialties(): Promise<SpecialtyModel[]> {
    return doGetSpecialties()
}

export const useSpecialtyStore = () => ({
    getSpecialties
})