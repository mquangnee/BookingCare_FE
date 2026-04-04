import { buildApiUrl } from '../utils/apiConfig'
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { EnumGender, EnumPosition } from '../constants/enum'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === Models ===
export type SpecialtyModel = {
    id: string
    specialtyCode?: string
    name?: string
    imageUrl?: string
    description?: string
}

// === API ===
export async function doGetSpecialties(): Promise<SpecialtyModel[]> {
    const url = buildApiUrl('/specialty')

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
    return (await res.json()).result as SpecialtyModel[]
}