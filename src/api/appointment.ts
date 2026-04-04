import { buildApiUrl } from "../utils/apiConfig"
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { EnumAppointmentStatus } from "../constants/enum"

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

export type BookingHistoryModel = {
    id: string
    appointmentCode: string
    date: string
    startTime: string
    endTime: string
    queueNumber?: number
    status: EnumAppointmentStatus
    doctorName: string
    doctorCode: string
    doctorId: string
    specialtyName: string
    patientProfileName: string
    patientProfileCode: string
    patientProfileId: string
    services: string[]
    createdDate: string
}

export type PagedResult<T> = {
    items: T[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export type GetBookingHistoryModel = {
    status?: EnumAppointmentStatus
    doctorName?: string
    patientProfileName?: string
    pageNumber?: number
}

// === API ===
export async function doCreateAppointment(body: CreateAppointmentModel): Promise<void> {
    const url = buildApiUrl('/appointment/create')

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

    const url = `${buildApiUrl('/appointment/booking-history')}?${queryParams.toString()}`;

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
    const url = buildApiUrl(`/appointment/cancel/${appointmentId}`)

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