import { EnumAccountStatus, EnumGender, EnumPosition } from "../constants/enum"

export type DoctorModel = {
    id: string
    userId: string
    serviceId: string
    specialtyId: string
    specialtyName?: string
    doctorCode?: string
    email?: string
    phoneNumber?: string
    avatarUrl?: string
    fullName?: string
    dateOfBirth: string
    gender: EnumGender
    citizenId?: string
    experienceYears: number
    position: EnumPosition
    workingHistory?: string
    description?: string
    status?: EnumAccountStatus
    price?: number
}