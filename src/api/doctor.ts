import { buildApiUrl } from '../utils/apiConfig'
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { EnumGender, EnumPosition } from '../constants/enum'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

//=== Models ===
export type DoctorModel = {
    id: string
    userId: string
    specialtyId: string
    doctorCode?: string
    avatarUrl?: string
    fullName?: string
    dateOfBirth: string
    gender: EnumGender
    citizenId?: string
    experienceYears: number
    position: EnumPosition
    subSpecialties?: string[]
    workingHistory?: string
    description?: string
    price?: number
}

//=== API ===
export async function doGetDoctorsBySpecialty(specialtyId: string): Promise<DoctorModel[]> {
    const url = buildApiUrl(`/doctor/${specialtyId}`)
    
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
    return (await res.json()).result as DoctorModel[]
}