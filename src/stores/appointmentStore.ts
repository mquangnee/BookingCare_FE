import { doCancelAppointment, doCreateAppointment, doGetAppointmentHistory } from "../api/appointment"
import type { CreateAppointmentModel, PagedResult, BookingHistoryModel, GetBookingHistoryModel } from "../api/appointment"

async function createAppointment(appointmentData: CreateAppointmentModel): Promise<void> {
    doCreateAppointment(appointmentData)
}

async function getHistory(payload: GetBookingHistoryModel): Promise<PagedResult<BookingHistoryModel>> {
    return await doGetAppointmentHistory(payload)
}

async function cancelAppointment(appointmentId: string): Promise<boolean> {
    return await doCancelAppointment(appointmentId)
}

export const useAppointmentStore = () => ({
    createAppointment,
    getHistory,
    cancelAppointment
});