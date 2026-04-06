import { buildApiUrl } from '../utils/apiConfig'
import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === Models ===
export type ServiceModel = {
    id: string
    serviceCode?: string
    name?: string
    price: number
    description?: string
    durationInMinutes: number
    isActive: boolean
}

// === API ===
export async function doGetServices(): Promise<ServiceModel[]> {
    const url = buildApiUrl('patient/service')

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
    return (await res.json()).result as ServiceModel[]
}