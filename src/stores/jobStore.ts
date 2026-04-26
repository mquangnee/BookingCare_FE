import { JobConfigModel, TriggerJobModel } from '../types/index'
import { doGetJobConfigs, doTriggerJob } from '../api/jobApi'

async function GetJobConfigs(): Promise<JobConfigModel[]> {
    return await doGetJobConfigs()
}

async function TriggerJob(payload: TriggerJobModel): Promise<boolean> {
    return await doTriggerJob(payload)
}

export const useJobStore = () => ({
    GetJobConfigs,
    TriggerJob
})