import { EnumBloodType, EnumGender, EnumRelationship, EnumSharePermission, EnumShareStatus } from "../constants/enum"
import { ErrorMessageDictionary } from '../constants/ErrorMessageDictionary'
import { buildApiUrl } from "../utils/apiConfig"

// === Models ===
export type UserProfileModel = {
    id: string
    patientCode: string
    profileCode: string
    fullName: string
    dateOfBirth: string
    gender: EnumGender
    citizenId: string
    phoneNumber: string
    relationship: EnumRelationship
    bloodType: EnumBloodType
    medicalHistory?: string
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
    relationship: EnumRelationship
    bloodType: EnumBloodType
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

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetUserProfile(): Promise<UserProfileModel> {
    const url = buildApiUrl('/profile')

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as UserProfileModel
}

export async function doUpdateUserProfile(data: UpdateUserProfileModel): Promise<boolean> {
    const url = buildApiUrl('/profile/update')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doGetUserProfiles(): Promise<UserProfileModel[]> {
    const url = buildApiUrl('/profile/all')

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as UserProfileModel[]
}

export async function doCreateUserProfile(data: CreateUserProfileModel): Promise<boolean> {
    const url = buildApiUrl('/profile/create')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doShareUserProfile(data: ShareProfileModel): Promise<boolean> {
    const url = buildApiUrl('/profile/share')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doGetSharedProfiles(): Promise<SharedProfileModel[]> {
    const url = buildApiUrl('/profile/get-shared')

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as SharedProfileModel[]
}

export async function doCancelSharedProfile(profileShareId: string): Promise<boolean> {
    const url = buildApiUrl('/profile/cancel')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ profileShareId })
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}