import { EnumAppointmentStatus } from './enum'

export interface StatusDetail {
  text: string
  color: string
  bg: string
}

export const appointmentStatusMap: Record<EnumAppointmentStatus, StatusDetail> = {
  [EnumAppointmentStatus.Pending]: {
    text: 'Chờ xác nhận',
    color: '#f59e0b',
    bg: '#fef3c7'
  },
  [EnumAppointmentStatus.Approved]: {
    text: 'Đã xác nhận',
    color: '#3b82f6',
    bg: '#dbeafe'
  },
  [EnumAppointmentStatus.InProgress]: {
    text: 'Đang khám',
    color: '#8b5cf6',
    bg: '#ede9fe'
  },
  [EnumAppointmentStatus.Completed]: {
    text: 'Đã hoàn thành',
    color: '#10b981',
    bg: '#d1fae5'
  },
  [EnumAppointmentStatus.Canceled]: {
    text: 'Đã hủy',
    color: '#ef4444',
    bg: '#fee2e2'
  }
}

export const getStatusDetail = (status: EnumAppointmentStatus): StatusDetail => {
  return appointmentStatusMap[status] || appointmentStatusMap[EnumAppointmentStatus.Pending]
}

export const getStatusText = (status: EnumAppointmentStatus): string => {
  return getStatusDetail(status).text
}
