import { EnumNotificationType } from "../constants/enum"

export type NotificationModel = {
    notificationId: string
    receiverId: string
    senderId: string
    shareProfileID?: string
    message: string
    type: EnumNotificationType
    objectId: string
    isRead: boolean
    isAccepted: boolean
    isActioned: boolean
    createdDate: string
}

export type MarkNotificationReadModel = {
    notificationId: string
    isRead: boolean
}

export type RespondNotificationModel = {
    notificationId: string
    isAccepted: boolean
}