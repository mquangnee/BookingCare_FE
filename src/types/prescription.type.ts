import { EnumMedicineUnit } from "../constants/enum"

export type SendMedicalReportModel = {
    appointmentId: string
    diagnosis?: string
    instructions?: string
    prescriptionDetails?: PrescriptionDetailModel[]
}

export type PrescriptionModel = {
    appointmentId: string
    prescriptionId: string
    diagnosis?: string
    instructions?: string
    prescriptionDetails?: PrescriptionDetailModel[]
}

export type PrescriptionDetailModel = {
    id: string
    prescriptionId: string
    medicineId: string
    medicineName?: string
    medicineUnit?: EnumMedicineUnit
    dosage?: string
    usage?: string
}