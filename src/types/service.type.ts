import { DoctorModel } from "./doctor.type"

export type ServiceModel = {
    id: string
    specialtyId: string
    serviceCode?: string
    name?: string
    price: number
    description?: string
    durationInMinutes: number
    isActive: boolean
    doctors: DoctorModel[]
}

export type CreateServiceModel = {
    specialtyId: string
    name: string
    price: number
    description?: string
    durationInMinutes: number
}

export type UpdateServiceModel = {
    id: string
    specialtyId: string
    name: string
    price: number
    description?: string
    durationInMinutes: number
}