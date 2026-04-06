import { buildApiUrl } from '../utils/apiConfig'
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === Models ===
export type AvailableDayModel = {
    date: string
    availableTimeSlots: AvailableTimeSlotModel[]
}

export type AvailableTimeSlotModel = {
    startTime: string
    endTime: string
    timeString: string
    isFull: boolean
    doctorId?: string
    doctorName?: string
    doctorPosition?: number
}

// === API ===
export async function doGetAvailableTimeSlots(body: { serviceId?: string; doctorId?: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    const params = new URLSearchParams();
    
    if (body.doctorId) {
        params.append('doctorId', body.doctorId);
    }
    if (body.serviceId) {
        params.append('serviceId', body.serviceId);
    }
    
    params.append('date', body.date);
    params.append('durationInMinutes', body.durationInMinutes.toString());

    const url = `${buildApiUrl('patient/worksession/available')}?${params.toString()}`;

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
    return (await res.json()).result as AvailableDayModel[]
}