import { doCreateAppointment } from "../api/appointment"
import type { CreateAppointmentModel } from "../api/appointment"

async function createAppointment(appointmentData: CreateAppointmentModel): Promise<void> {
    doCreateAppointment(appointmentData)
}

export const useAppointmentStore = () => ({
    createAppointment
});