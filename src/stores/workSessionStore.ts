import { doGetAvailableTimeSlots } from "../api/worksession";
import type { AvailableDayModel, AvailableTimeSlotModel } from "../api/worksession";

// Thêm serviceId và đặt dấu '?' để cho phép undefined
async function getAvailableTimeSlots(body: { doctorId?: string; serviceId?: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    return doGetAvailableTimeSlots(body);
}

export const useWorkSessionStore = () => ({
    getAvailableTimeSlots
})