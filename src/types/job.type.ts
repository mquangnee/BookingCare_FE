export type JobConfigModel = {
    id: string
    jobName: string
    description?: string
    cronExpression: string
    isEnabled: boolean
    endpoint?: string
    createdDate: string
    updatedDate?: string
    nextRun?: string
}

export type UpdateJobConfigModel = {
    jobName: string
    cronExpression?: string
    isEnabled?: boolean
}

export type TriggerJobModel = {
    jobName: string
}