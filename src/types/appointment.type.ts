import { EnumAccountStatus, EnumAppointmentPriority, EnumAppointmentStatus, EnumAppointmentType, EnumGender } from "../constants/enum"

export type AppointmentModel = {
    id: string
    appointmentCode?: string
    bookerId: string
    workSessionId: string
    doctorName: string
    patientProfileId: string
    patientName: string
    age?: number
    gender?: EnumGender
    type?: EnumAppointmentType
    status?: EnumAppointmentStatus
    priority?: EnumAppointmentPriority
    date: string
    startTime?: string
    endTime?: string
    checkInDate?: string
}

export type CreateAppointmentModel = {
    patientProfileId: string
    doctorId?: string
    serviceId?: string
    date: string
    startTime: string
    endTime: string
}

export type BookingHistoryModel = {
    id: string
    appointmentCode: string
    date: string
    startTime: string
    endTime: string
    status: EnumAppointmentStatus
    doctorName: string
    doctorCode: string
    doctorId: string
    specialtyName: string
    patientProfileName: string
    patientProfileCode: string
    patientProfileId: string
    serviceId: string
    serviceName: string
    createdDate: string
    prescriptionId: string
}

export type GetBookingHistoryModel = {
    status?: EnumAppointmentStatus
    doctorName?: string
    patientProfileName?: string
}

export type ChangeAppointmentStatusModel = {
    appointmentId: string
    status: EnumAccountStatus
    priority: EnumAppointmentPriority
}

export type PaymentResponseModel = {
    checkoutUrl: string
    appointmentId: string
    paymentId: string
    paymentCode: string
    formFields: Record<string, string>
}

export type MedicalHistoryModel = {
    appointmentId: string
    workSessionId: string
    patientProfileId: string
    appointmentCode: string
    patientProfileCode: string
    doctorName: string
    patientName: string
    age?: number
    diagnosis?: string
    gender?: EnumGender
    type?: EnumAppointmentType
    date: string
    startTime?: string
    endTime?: string
}