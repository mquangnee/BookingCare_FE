import { MedicineModel } from "../types/index"
import { doGetMedicines } from "../api/medicine"

async function getMedicines(): Promise<MedicineModel[]> {
    return await doGetMedicines();
}

export const useMedicineStore = () => ({
    getMedicines
})