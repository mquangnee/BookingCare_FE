import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'
import { buildApiUrl } from "../utils/apiConfig"
import { CreateUserProfileModel, GetUserProfileForBookingModel, ShareProfileModel, SharedProfileModel, UpdateUserProfileModel, PatientProfileModel } from "../types/profile.type"
import { DoctorModel } from '../types'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetUserProfile(): Promise<PatientProfileModel> {
    const url = buildApiUrl('patient/profile')

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
    return (await res.json()).result as PatientProfileModel
}

export async function doUpdateUserProfile(data: UpdateUserProfileModel): Promise<boolean> {
    const url = buildApiUrl('patient/profile/update')

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

export async function doGetUserProfiles(): Promise<PatientProfileModel[]> {
    const url = buildApiUrl('patient/profile/all')

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
    return (await res.json()).result as PatientProfileModel[]
}

export async function doCreateUserProfile(data: CreateUserProfileModel): Promise<boolean> {
    const url = buildApiUrl('patient/profile/create')

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
    const url = buildApiUrl('patient/profile/share')

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
    const url = buildApiUrl('patient/profile/get-shared')

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
    const url = buildApiUrl('patient/profile/cancel')

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

export async function doGetUserProfileForBooking(body: GetUserProfileForBookingModel): Promise<PatientProfileModel[]> {
    const url = buildApiUrl(`patient/profile/available?date=${body.date}&startTime=${body.startTime}&endTime=${body.endTime}`)

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }

    return (await res.json()).result as PatientProfileModel[]
}

export async function doSearchPatientProfiles(keyword: string): Promise<PatientProfileModel[]> {
    const url = buildApiUrl(`receptionist/profile/search?keyword=${encodeURIComponent(keyword)}`)

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as PatientProfileModel[]
}

export async function doCreatePatientProfileByReceptionist(payload: CreateUserProfileModel): Promise<PatientProfileModel> {
    const url = buildApiUrl(`receptionist/profile/create`)

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(payload)
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as PatientProfileModel
}

export async function doGetDoctorProfile(): Promise<DoctorModel> {
    const url = buildApiUrl(`doctor/profile`)

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as DoctorModel
}