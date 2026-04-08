import { doGetUserProfile, doUpdateUserProfile, doGetUserProfiles, doCreateUserProfile, doShareUserProfile, doGetSharedProfiles, doCancelSharedProfile, doGetUserProfileForBooking } from "../api/profile"
import type { UpdateUserProfileModel, UserProfileModel, CreateUserProfileModel, ShareProfileModel, SharedProfileModel, GetUserProfileForBookingModel } from "../types/index"

async function getUserProfile() : Promise<UserProfileModel> {
    return doGetUserProfile()
}

async function updateUserProfile(body: UpdateUserProfileModel) {
    return doUpdateUserProfile(body)
}

async function getUserProfiles() {
    return doGetUserProfiles()
}

async function createUserProfile(data: CreateUserProfileModel) {
    return doCreateUserProfile(data)
}

async function shareUserProfile(data: ShareProfileModel) {
    return doShareUserProfile(data)
}

async function getSharedProfiles() : Promise<SharedProfileModel[]> {
    return doGetSharedProfiles()
}

async function cancelSharedProfile(sharedProfileId: string) {
    return doCancelSharedProfile(sharedProfileId)
}
    
async function getUserProfileForBooking(body: GetUserProfileForBookingModel) {
    return doGetUserProfileForBooking(body)
}

export const useProfileStore = () => ({
    getUserProfile,
    updateUserProfile,
    getUserProfiles,
    createUserProfile,
    shareUserProfile,
    getSharedProfiles,
    cancelSharedProfile,
    getUserProfileForBooking
})