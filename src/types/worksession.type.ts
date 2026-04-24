import { EnumPosition } from "../constants/enum"

export type WorkSessionModel = {
    id?: string
    doctorId?: string
    userId?: string
    specialtyId?: string
    doctorCode?: string
    doctorName?: string
    specialtyName?: string
    avatarUrl?: string
    position?: EnumPosition
    durationInMinutes?: number
    doctorPrice?: number
    date?: string
    startTime?: string
    endTime?: string
}

export type AvailableDayModel = {
    date: string
    availableTimeSlots: AvailableTimeSlotModel[]
}

export type AvailableTimeSlotModel = {
    workSessionId: string
    startTime: string
    endTime: string
    timeString: string
    isFull: boolean
    doctorId?: string
    doctorName?: string
    doctorPosition?: number
}