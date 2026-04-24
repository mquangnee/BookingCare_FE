import { doGetAvailableTimeSlots, doGetDoctorWorkSessions, doGetSchedules, doRegisterWorkSession } from "../api/worksession"
import { EnumShift } from "../constants/enum";
import type { AvailableDayModel, WorkSessionModel } from "../types/index"

async function getAvailableTimeSlots(body: { doctorId?: string; serviceId?: string; date: string; durationInMinutes: number }): Promise<AvailableDayModel[]> {
    return doGetAvailableTimeSlots(body);
}

async function getDoctorWorkSessions(date: string): Promise<WorkSessionModel[]> {
    return doGetDoctorWorkSessions(date);
}

async function getSchedules(startDate: string): Promise<WorkSessionModel[]> {
    return doGetSchedules(startDate);
}

async function registerWorkSession(date: string, shift: EnumShift): Promise<WorkSessionModel> {
    return doRegisterWorkSession({ date, shift });
}

export const useWorkSessionStore = () => ({
    getAvailableTimeSlots,
    getDoctorWorkSessions,
    getSchedules,
    registerWorkSession
})