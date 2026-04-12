export type SendMedicalReportModel = {
    appointmentId: string
    diagnosis?: string
    instructions?: string
    prescriptionDetails?: PrescriptionDetail[]
}

export type PrescriptionDetail = {
    medicineId: string
    dosage?: string
    usage?: string
}