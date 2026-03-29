import { doGetSpecialties } from "../api/specialty"
import type { SpecialtyModel } from "../api/specialty"

async function getSpecialties(): Promise<SpecialtyModel[]> {
    return doGetSpecialties()
}

export const useSpecialtyStore = () => ({
    getSpecialties
})