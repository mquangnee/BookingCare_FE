import {
    doGetUserProfile,
    doUpdateUserProfile,
    doGetUserProfiles, 
    doCreateUserProfile,
    doShareUserProfile,
    doGetSharedProfiles,
    doCancelSharedProfile,
    UpdateUserProfileModel, 
    UserProfileModel, 
    CreateUserProfileModel,
    ShareProfileModel,
    SharedProfileModel
 } from "../api/profile";

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

export const useProfileStore = () => ({
    getUserProfile,
    updateUserProfile,
    getUserProfiles,
    createUserProfile,
    shareUserProfile,
    getSharedProfiles,
    cancelSharedProfile
})