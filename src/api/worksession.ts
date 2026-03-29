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
    isFull: boolean
}

// === API ===
export async function doGetAvailableTimeSlots(body: { doctorId: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    const url = `/api/worksession/available?doctorId=${body.doctorId}&date=${body.date}&durationInMinutes=${body.durationInMinutes}`

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