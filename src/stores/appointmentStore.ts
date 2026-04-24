import { doCancelAppointment, doChangeAppointmentStatus, doCompleteAppointment, doCreateAppointment, doExportMedicalReport, doGetAppointmentHistory, doGetAppointmentsByWorkSessionId, doGetAppointmentsToday, doGetMedicalHistory, doGetMedicalReportDoctor, doGetMedicalReportPatient } from "../api/appointment"
import type { CreateAppointmentModel, PagedResult, BookingHistoryModel, GetBookingHistoryModel, AppointmentModel, ChangeAppointmentStatusModel, PaymentResponseModel, PrescriptionModel, MedicalHistoryModel } from "../types/index"
import { SendMedicalReportModel } from "../types/prescription.type"

async function createAppointment(appointmentData: CreateAppointmentModel): Promise<PaymentResponseModel> {
    return await doCreateAppointment(appointmentData)
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

async function getMedicalReportPatient(appointmentId: string): Promise<PrescriptionModel> {
    return await doGetMedicalReportPatient(appointmentId)
}

async function getMedicalHistory(keyword?: string, fromDate?: string, toDate?: string): Promise<MedicalHistoryModel[]> {
    return await doGetMedicalHistory(keyword, fromDate, toDate)
}

async function getMedicalReportDoctor(appointmentId: string): Promise<PrescriptionModel> {
    return await doGetMedicalReportDoctor(appointmentId)
}

async function exportMedicalReport(appointmentId: string): Promise<Blob> {
    return await doExportMedicalReport(appointmentId)
}

export const useAppointmentStore = () => ({
    createAppointment,
    getHistory,
    cancelAppointment,
    getAppointmentsToday,
    completeAppointment,
    getAppointmentsByWorkSessionId,
    changeAppointmentStatus,
    getMedicalReportPatient,
    getMedicalReportDoctor,
    getMedicalHistory,
    exportMedicalReport
});