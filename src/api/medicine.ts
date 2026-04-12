import { buildApiUrl } from "../utils/apiConfig"
import { ErrorMessageDictionary } from "../constants/errorMessageDictionary"
import { MedicineModel } from "../types/index"

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetMedicines(): Promise<MedicineModel[]> {
    const url = buildApiUrl('doctor/medicine/all')

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
    return (await res.json()).result as MedicineModel[]
}