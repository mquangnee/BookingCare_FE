import { doGetAvailableTimeSlots } from "../api/worksession";
import type { AvailableDayModel, AvailableTimeSlotModel } from "../api/worksession";

async function getAvailableTimeSlots(body: { doctorId: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    return doGetAvailableTimeSlots(body);
}

export const useWorkSessionStore = () => ({
    getAvailableTimeSlots
})