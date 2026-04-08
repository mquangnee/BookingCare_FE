import { buildApiUrl } from "../utils/apiConfig"
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { BookingHistoryModel, CreateAppointmentModel, GetBookingHistoryModel, PagedResult } from "../types/index"

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doCreateAppointment(body: CreateAppointmentModel): Promise<void> {
    const url = buildApiUrl('patient/appointment/create')

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

export async function doGetAppointmentHistory(payload: GetBookingHistoryModel): Promise<PagedResult<BookingHistoryModel>> {
    const pageNumber = payload.pageNumber || 1;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
    });

    if (payload.status !== undefined && payload.status !== null) {
        queryParams.append('status', payload.status.toString());
    }
    if (payload.doctorName) {
        queryParams.append('doctorName', payload.doctorName.trim());
    }
    if (payload.patientProfileName) {
        queryParams.append('patientProfileName', payload.patientProfileName.trim());
    }

    const url = `${buildApiUrl('patient/appointment/booking-history')}?${queryParams.toString()}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages?.[0]?.errorCode]
        throw new Error(errorMessage)
    }
    return (await res.json()).result as PagedResult<BookingHistoryModel>
}

export async function doCancelAppointment(appointmentId: string): Promise<boolean> {
    const url = buildApiUrl(`patient/appointment/cancel/${appointmentId}`)

    const res = await fetch(url, {
        method: 'POST',
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
    return (await res.json()).result as Promise<boolean>
}