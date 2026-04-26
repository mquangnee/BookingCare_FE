import { buildApiUrl } from '../utils/apiConfig'
import { JobConfigModel, TriggerJobModel } from '../types/index'
import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'

const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

export async function doGetJobConfigs(): Promise<JobConfigModel[]> {
    const url = buildApiUrl('admin/jobs')

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as JobConfigModel[]
}

export async function doTriggerJob(payload: TriggerJobModel): Promise<boolean> {
    const url = buildApiUrl('admin/jobs/trigger')

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
    return true
}