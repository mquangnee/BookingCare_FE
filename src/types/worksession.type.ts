export type AvailableDayModel = {
    date: string
    availableTimeSlots: AvailableTimeSlotModel[]
}

export type AvailableTimeSlotModel = {
    startTime: string
    endTime: string
    timeString: string
    isFull: boolean
    doctorId?: string
    doctorName?: string
    doctorPosition?: number
}