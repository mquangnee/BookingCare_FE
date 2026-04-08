import { buildApiUrl } from '../utils/apiConfig'
import { ChartDataModel, DashboardSummaryModel, DashboardMetricModel , SpecialtyDistributionModel, DoctorModel, UpdateDoctorModel, LockUnlockAccountModel, CreateDoctorAccountModel } from '../types/index'
import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'
import { P } from 'vue-router/dist/router-CWoNjPRp.mjs'

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

export async function doUpdateDoctorInfo(payload: UpdateDoctorModel): Promise<boolean> {
    const url = buildApiUrl('admin/doctor/update')

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