import { EnumMedicineUnit, EnumStatus } from "../constants/enum"

export type MedicineModel = {
    id: string
    name?: string
    unit: EnumMedicineUnit
    function?: string
    status?: EnumStatus
}
