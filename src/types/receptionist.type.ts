import { EnumGender, EnumStatus } from "../constants/enum"

export type ReceptionistModel = {
    id: string
    userId: string
    receptionistCode?: string
    email?: string
    phoneNumber?: string
    avatarUrl?: string
    fullName?: string
    dateOfBirth: string
    gender?: EnumGender
    citizenId?: string
    status?: EnumStatus
}
