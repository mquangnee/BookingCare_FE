import { ChartDataModel, DashboardMetricModel, DashboardSummaryModel, DoctorModel, SpecialtyDistributionModel, UpdateDoctorModel, LockUnlockAccountModel } from "../types";
import { doGetDashboardSummary, doGetTotalDoctors, doGetWeeklyBookingChart, doGetWeeklySpecialtyChart, doUpdateAccountStatus, doUpdateDoctorInfo, doCreateDoctorAccount } from "../api/dashboard";

async function GetDashboardSummary() : Promise<DashboardSummaryModel>{
    return await doGetDashboardSummary()
}

async function GetWeeklyBookingData() : Promise<ChartDataModel[]>{
    return await doGetWeeklyBookingChart()
}

async function GetWeeklySpecialtyData() : Promise<SpecialtyDistributionModel[]>{
    return await doGetWeeklySpecialtyChart()
}

async function GetTotalDoctors() : Promise<DashboardMetricModel<DoctorModel>> {
    return await doGetTotalDoctors()
}

async function UpdateDoctorInfor(payload: UpdateDoctorModel) : Promise<boolean> {
    return await doUpdateDoctorInfo(payload)
}

async function UpdateAccountStatus(payload: LockUnlockAccountModel) {
    return await doUpdateAccountStatus(payload)
}

async function CreateDoctorAccount(formData: FormData) : Promise<boolean> {
    return await doCreateDoctorAccount(formData)
}

export const useDashboardStore = () => ({
    GetDashboardSummary,    
    GetWeeklyBookingData,
    GetWeeklySpecialtyData,
    GetTotalDoctors,
    UpdateDoctorInfor,
    UpdateAccountStatus,
    CreateDoctorAccount
})
