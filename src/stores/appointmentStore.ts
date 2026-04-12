import { doCancelAppointment, doChangeAppointmentStatus, doCompleteAppointment, doCreateAppointment, doGetAppointmentHistory, doGetAppointmentsByWorkSessionId, doGetAppointmentsToday } from "../api/appointment"
import type { CreateAppointmentModel, PagedResult, BookingHistoryModel, GetBookingHistoryModel, AppointmentModel, ChangeAppointmentStatusModel } from "../types/index"
import { SendMedicalReportModel } from "../types/prescription.type"

async function createAppointment(appointmentData: CreateAppointmentModel): Promise<void> {
    doCreateAppointment(appointmentData)
}

async function getHistory(payload?: GetBookingHistoryModel): Promise<PagedResult<BookingHistoryModel>> {
    return await doGetAppointmentHistory(payload)
}

async function cancelAppointment(appointmentId: string): Promise<boolean> {
    return await doCancelAppointment(appointmentId)
}

async function getAppointmentsToday() : Promise<AppointmentModel[]> {
    return await doGetAppointmentsToday()
}

async function completeAppointment(payload: SendMedicalReportModel): Promise<boolean> {
    return await doCompleteAppointment(payload)
}

async function getAppointmentsByWorkSessionId(doctorId: string): Promise<AppointmentModel[]> {
    return await doGetAppointmentsByWorkSessionId(doctorId)
}

async function changeAppointmentStatus(payload: ChangeAppointmentStatusModel): Promise<boolean> {
    return await doChangeAppointmentStatus(payload)
}

export const useAppointmentStore = () => ({
    createAppointment,
    getHistory,
    cancelAppointment,
    getAppointmentsToday,
    completeAppointment,
    getAppointmentsByWorkSessionId,
    changeAppointmentStatus
});