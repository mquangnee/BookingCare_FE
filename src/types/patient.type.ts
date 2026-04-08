import { EnumBloodType, EnumGender } from "../constants/enum"

export type PatientModel = {
    id: string
    userId: string
    patientCode?: string
    email?: string
    phoneNumber?: string
    fullName?: string
    dateOfBirth: string
    gender: EnumGender
    citizenId?: string
    bloodType: EnumBloodType
    medicalHistory?: string
}