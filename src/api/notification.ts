import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'
import { buildApiUrl } from "../utils/apiConfig"
import { MarkNotificationReadModel, NotificationModel, RespondNotificationModel } from '../types/index'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetNotifications(): Promise<NotificationModel[]> {
    const url = buildApiUrl('/notification')

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
    return (await res.json()).result as NotificationModel[]
}

export async function doMarkNotificationRead(data: MarkNotificationReadModel): Promise<boolean> {
    const url = buildApiUrl('/notification/read')

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

export async function doRespondNotification(data: RespondNotificationModel): Promise<boolean> {
    const url = buildApiUrl('/notification/respond')

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