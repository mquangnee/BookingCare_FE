import { doGetAvailableTimeSlots } from "../api/worksession"
import type { AvailableDayModel } from "../types/index"

async function getAvailableTimeSlots(body: { doctorId?: string; serviceId?: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    return doGetAvailableTimeSlots(body);
}

export const useWorkSessionStore = () => ({
    getAvailableTimeSlots
})