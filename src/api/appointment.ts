import { buildApiUrl } from "../utils/apiConfig"
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { AppointmentModel, BookingHistoryModel, ChangeAppointmentStatusModel, CreateAppointmentModel, GetBookingHistoryModel, PagedResult, SendMedicalReportModel, PaymentResponseModel, PrescriptionModel, MedicalHistoryModel } from "../types/index"

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doCreateAppointment(body: CreateAppointmentModel): Promise<PaymentResponseModel> {
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
    const data = await res.json()
    return data.result as PaymentResponseModel
}

export async function doGetAppointmentHistory(payload?: GetBookingHistoryModel): Promise<PagedResult<BookingHistoryModel>> {

    const queryParams = new URLSearchParams({});

    if (payload?.status !== undefined && payload?.status !== null) {
        queryParams.append('status', payload.status.toString());
    }
    if (payload?.doctorName) {
        queryParams.append('doctorName', payload.doctorName.trim());
    }
    if (payload?.patientProfileName) {
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

export async function doGetAppointmentsToday(): Promise<AppointmentModel[]> {
    const url = buildApiUrl('doctor/appointment/today')

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
    return (await res.json()).result as AppointmentModel[]
}

export async function doCompleteAppointment(payload: SendMedicalReportModel): Promise<boolean> {
    const url = buildApiUrl('doctor/appointment/complete')

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
    return (await res.json()).result as boolean
}

export async function doGetAppointmentsByWorkSessionId(worksessionId: string): Promise<AppointmentModel[]> {
    const url = buildApiUrl(`receptionist/appointment/${worksessionId}`)

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
    return (await res.json()).result as AppointmentModel[]
}

export async function doChangeAppointmentStatus(payload: ChangeAppointmentStatusModel): Promise<boolean> {
    const url = buildApiUrl(`receptionist/appointment/status`)

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
    return (await res.json()).result as boolean
}

export async function doGetMedicalReportPatient(appointmentId: string): Promise<PrescriptionModel> {
    const url = buildApiUrl(`patient/appointment/result/${appointmentId}`)

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
    return (await res.json()).result as PrescriptionModel
}

export async function doGetMedicalReportDoctor(appointmentId: string): Promise<PrescriptionModel> {
    const url = buildApiUrl(`doctor/appointment/report/${appointmentId}`)

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
    return (await res.json()).result as PrescriptionModel
}

export async function doGetMedicalHistory(keyword?: string, fromDate?: string, toDate?: string): Promise<MedicalHistoryModel[]> {
    const queryParams = new URLSearchParams({});

    if (keyword) {
        queryParams.append('keyword', keyword.trim());
    }
    if (fromDate) {
        queryParams.append('fromDate', fromDate);
    }
    if (toDate) {
        queryParams.append('toDate', toDate);
    }
    const url = `${buildApiUrl('doctor/appointment/history')}?${queryParams.toString()}`;

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
    return (await res.json()).result as MedicalHistoryModel[]
}

export async function doExportMedicalReport(appointmentId: string): Promise<Blob> {
    const url = buildApiUrl(`doctor/appointment/export/${appointmentId}`)

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
            'Accept': 'application/pdf'
        }
    })
    
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    
    return await res.blob()
}