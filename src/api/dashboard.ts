import { buildApiUrl } from '../utils/apiConfig'
import { ChartDataModel, DashboardSummaryModel, DashboardMetricModel , SpecialtyDistributionModel, DoctorModel, UpdateDoctorModel, LockUnlockAccountModel, CreateDoctorAccountModel, ServiceModel, CreateReceptionistAccountModel, ReceptionistModel } from '../types/index'
import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetDashboardSummary(): Promise<DashboardSummaryModel> {
    const url = buildApiUrl('admin/dashboard/summary')

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
    return (await res.json()).result as DashboardSummaryModel
}

export async function doGetWeeklyBookingChart(): Promise<ChartDataModel[]> {
    const url = buildApiUrl('admin/dashboard/booking-chart')

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
    return (await res.json()).result as ChartDataModel[]
}

export async function doGetWeeklySpecialtyChart(): Promise<SpecialtyDistributionModel[]> {
    const url = buildApiUrl('admin/dashboard/specialty-chart')

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
    return (await res.json()).result as SpecialtyDistributionModel[]
}

export async function doGetTotalDoctors() : Promise<DashboardMetricModel<DoctorModel>> {
    const url = buildApiUrl('admin/doctor/all')

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
    return (await res.json()).result as DashboardMetricModel<DoctorModel>
}

export async function doUpdateDoctorInfo(formData: FormData): Promise<boolean> {
    const url = buildApiUrl('admin/doctor/update')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doUpdateAccountStatus(payload: LockUnlockAccountModel): Promise<boolean> {
    const url = buildApiUrl('admin/doctor/lock-unlock')

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

export async function doCreateDoctorAccount(formData: FormData) : Promise<boolean> {
    const url = buildApiUrl('admin/doctor/create')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doGetServicesBySpecialty(specialtyId: string): Promise<ServiceModel[]> {
    const url = buildApiUrl(`admin/service/specialty/${specialtyId}`)

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
    return (await res.json()).result as ServiceModel[]
}

export async function doCreateReceptionistAccount(formData: FormData): Promise<boolean> {
    const url = buildApiUrl('admin/receptionist/create')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doUpdateReceptionistInfo(formData: FormData): Promise<boolean> {
    const url = buildApiUrl('admin/receptionist/update')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData
    })  

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
    }
    return true
}

export async function doUpdateReceptionistAccountStatus(payload: LockUnlockAccountModel): Promise<boolean> {
    const url = buildApiUrl('admin/receptionist/lock-unlock')

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

export async function doGetAllReceptionists(): Promise<DashboardMetricModel<ReceptionistModel>> {
    const url = buildApiUrl('admin/receptionist/all')

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
    return (await res.json()).result as DashboardMetricModel<ReceptionistModel>
}