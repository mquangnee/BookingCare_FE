import { EnumBloodType, EnumGender, EnumRelationship, EnumSharePermission, EnumShareStatus } from "../constants/enum"

export type PatientProfileModel = {
    id: string
    patientCode?: string
    profileCode: string
    fullName: string
    dateOfBirth: string
    gender: EnumGender
    citizenId: string
    phoneNumber: string
    relationship?: EnumRelationship
    bloodType?: EnumBloodType
    medicalHistory?: string
    isShared?: boolean
    sharePermission?: EnumSharePermission
}

export type UpdateUserProfileModel = {
    profileCode: string
    fullName?: string
    dateOfBirth?: string
    gender?: EnumGender
    citizenId?: string
    phoneNumber?: string
    relationship?: EnumRelationship
    bloodType?: EnumBloodType
    medicalHistory?: string
}

export type CreateUserProfileModel = {
    fullName: string
    dateOfBirth: string
    gender: EnumGender
    citizenId: string
    phoneNumber: string
    relationship?: EnumRelationship
    bloodType?: EnumBloodType
    medicalHistory?: string
}

export type ShareProfileModel = {
    profileId: string
    email: string
    permission: EnumSharePermission
}

export type SharedProfileModel = {
    id: string
    profileId: string
    sharedByUserId: string
    sharedToUserId: string
    userName: string
    email: string
    shareStatus: EnumShareStatus
    sharePermission: EnumSharePermission
    createdDate: string
}

export type GetUserProfileForBookingModel = {
    date: string
    startTime: string
    endTime: string
}