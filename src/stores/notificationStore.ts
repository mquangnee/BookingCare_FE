import { doGetNotifications, doMarkNotificationRead, doRespondNotification} from "../api/notification"
import type { NotificationModel, MarkNotificationReadModel, RespondNotificationModel } from "../types/index"

async function getNotifications() : Promise<NotificationModel[]> {
    return doGetNotifications()
}

async function markNotificationRead(data: MarkNotificationReadModel) : Promise<boolean> {
    return doMarkNotificationRead(data)
}

async function respondNotification(data: RespondNotificationModel) : Promise<boolean> {
    return doRespondNotification(data)
}

export const useNotificationStore = () => ({
    getNotifications,
    markNotificationRead,
    respondNotification
})