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
    serviceId: string
    specialtyId: string
    position: EnumPosition
    phoneNumber?: string
    experienceYears: number
    description?: string
    workingHistory?: string
    avatar?: File
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
    serviceId: string
    position: EnumPosition
    phoneNumber?: string
    experienceYears: number
    workingHistory?: string
    description?: string
}

export type CreateReceptionistAccountModel = {
    avatar?: File
    fullName: string
    email: string
    password: string
    citizenId: string
    gender: EnumGender
    dateOfBirth: Date
    phoneNumber?: string
}

export type UpdateReceptionistAccountModel = {
    receptionistId: string
    avatar?: File
    fullName?: string
    dateOfBirth?: Date
    gender?: EnumGender
    phoneNumber?: string
}