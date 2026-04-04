import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === Models ===
export type CreateAppointmentModel = {
    patientProfileId: string
    doctorId?: string
    serviceId?: string
    date: string
    startTime: string
    endTime: string
}

// === API ===
export async function doCreateAppointment(body: CreateAppointmentModel): Promise<void> {
    const url = '/api/appointment'

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
}