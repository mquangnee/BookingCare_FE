import { doGetUserProfile, UserProfileModel } from "../api/profile";

function getUserProfile() : Promise<UserProfileModel> {
    return doGetUserProfile()
}

export const useProfileStore = () => ({
    getUserProfile
})