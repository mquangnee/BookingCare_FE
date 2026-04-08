import { EnumAppointmentStatus } from "../constants/enum"

export type AppointmentModel = {
    id: string
    appointmentCode?: string
    bookerId: string
    workSessionId: string
    doctorName: string
    patientProfileId: string
    patientName: string
    date: string
    startTime?: string
    endTime?: string
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
    queueNumber?: number
    status: EnumAppointmentStatus
    doctorName: string
    doctorCode: string
    doctorId: string
    specialtyName: string
    patientProfileName: string
    patientProfileCode: string
    patientProfileId: string
    services: string[]
    createdDate: string
}

export type GetBookingHistoryModel = {
    status?: EnumAppointmentStatus
    doctorName?: string
    patientProfileName?: string
    pageNumber?: number
}
