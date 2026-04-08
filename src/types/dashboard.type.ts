import { EnumAccountStatus, EnumGender, EnumPosition } from "../constants/enum"
import { AppointmentModel } from "./appointment.type"
import { DoctorModel } from "./doctor.type"
import { PatientModel } from "./patient.type"
import { ServiceModel } from "./service.type"

export type DashboardMetricModel<T> = {
    data: T[]
    total: number
    balance?: number
}

export type DashboardSummaryModel = {
    appointments: DashboardMetricModel<AppointmentModel>
    doctors: DashboardMetricModel<DoctorModel>
    patients: DashboardMetricModel<PatientModel>
    services: DashboardMetricModel<ServiceModel>
}

export type ChartDataModel = {
    label?: string
    value: number
    date: Date
}

export type SpecialtyDistributionModel = {
    label?: string
    value: number
}

export type UpdateDoctorModel = {
    doctorId: string
    specialtyId: string
    position: EnumPosition
    phoneNumber?: string
    experienceYears: number
    description?: string
    workingHistory?: string
}

export type LockUnlockAccountModel = {
    userId: string
    newStatus: EnumAccountStatus
}

export type CreateDoctorAccountModel = {
    avatar?: File
    fullName: string
    email: string
    password: string
    citizenId: string
    gender: EnumGender
    dateOfBirth: Date
    specialtyId: string
    position: EnumPosition
    phoneNumber?: string
    experienceYears: number
    workingHistory?: string
    description?: string
}
