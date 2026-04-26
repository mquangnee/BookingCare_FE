export * from './auth.type'
export * from './doctor.type'
export * from './notification.type'
export * from './profile.type'
export * from './service.type'
export * from './specialty.type'
export * from './worksession.type'
export * from './appointment.type'
export * from './patient.type'
export * from './dashboard.type'
export * from './medicine.type'
export * from './prescription.type'
export * from './receptionist.type'
export * from './job.type'

export type PagedResult<T> = {
    items: T[]
    totalCount: number
}