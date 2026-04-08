import { buildApiUrl } from '../utils/apiConfig'
import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'
import { ServiceModel } from '../types/index'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
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