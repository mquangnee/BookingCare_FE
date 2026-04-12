import { doGetUserProfile, doUpdateUserProfile, doGetUserProfiles, doCreateUserProfile, doShareUserProfile, doGetSharedProfiles, doCancelSharedProfile, doGetUserProfileForBooking, doSearchPatientProfiles, doCreatePatientProfileByReceptionist, doGetDoctorProfile } from "../api/profile"
import type { UpdateUserProfileModel, CreateUserProfileModel, ShareProfileModel, SharedProfileModel, GetUserProfileForBookingModel, PatientProfileModel, DoctorModel } from "../types/index"
import { buildApiUrl } from "../utils/apiConfig"

async function getUserProfile() : Promise<PatientProfileModel> {
    return doGetUserProfile()
}

async function updateUserProfile(body: UpdateUserProfileModel) : Promise<boolean> {
    return doUpdateUserProfile(body)
}

async function getUserProfiles() : Promise<PatientProfileModel[]> {
    return doGetUserProfiles()
}

async function createUserProfile(data: CreateUserProfileModel) : Promise<boolean> {
    return doCreateUserProfile(data)
}

async function shareUserProfile(data: ShareProfileModel) : Promise<boolean> {
    return doShareUserProfile(data)
}

async function getSharedProfiles() : Promise<SharedProfileModel[]> {
    return doGetSharedProfiles()
}

async function cancelSharedProfile(sharedProfileId: string) : Promise<boolean> {
    return doCancelSharedProfile(sharedProfileId)
}
    
async function getUserProfileForBooking(body: GetUserProfileForBookingModel) : Promise<PatientProfileModel[]> {
    return doGetUserProfileForBooking(body)
}

async function searchPatientProfiles(keyword: string) : Promise<PatientProfileModel[]> {
    return doSearchPatientProfiles(keyword)
}

async function createPatientProfileByReceptionist(payload: CreateUserProfileModel) : Promise<PatientProfileModel> {
    return doCreatePatientProfileByReceptionist(payload)
}

async function getDoctorProfile() : Promise<DoctorModel> {
    return doGetDoctorProfile()
}

export const useProfileStore = () => ({
    getUserProfile,
    updateUserProfile,
    getUserProfiles,
    createUserProfile,
    shareUserProfile,
    getSharedProfiles,
    cancelSharedProfile,
    getUserProfileForBooking,
    searchPatientProfiles,
    createPatientProfileByReceptionist,
    getDoctorProfile
})