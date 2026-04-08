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

export type PagedResult<T> = {
    items: T[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}