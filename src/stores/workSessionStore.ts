import { doGetAvailableTimeSlots, doGetDoctorWorkSessions } from "../api/worksession"
import type { AvailableDayModel, WorkSessionModel } from "../types/index"

async function getAvailableTimeSlots(body: { doctorId?: string; serviceId?: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    return doGetAvailableTimeSlots(body);
}

async function getDoctorWorkSessions(date: string): Promise<WorkSessionModel[]> {
    return doGetDoctorWorkSessions(date);
}

export const useWorkSessionStore = () => ({
    getAvailableTimeSlots,
    getDoctorWorkSessions
})