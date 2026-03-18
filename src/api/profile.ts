import {  EnumBloodType, EnumGender, EnumRelationship } from "../constants/enum"
import { ErrorMessageDictionary } from '../constants/ErrorMessageDictionary'

// === Models ===
export type UserProfileModel = {
    patientCode: string
    fullName: string
    dateOfBirth: string
    gender: EnumGender
    citizenId: string
    phoneNumber: string
    relationship: EnumRelationship
    bloodType: EnumBloodType
    medicalHistory: string
}

// === Functions ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
}

// === API ===
export async function doGetUserProfile(): Promise<UserProfileModel> {
    const url = '/api/user/get-user-profile'

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
        throw new Error(errorMessage)
      }
      return (await res.json()).result as UserProfileModel
}