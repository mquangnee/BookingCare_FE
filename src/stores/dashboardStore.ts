import { ChartDataModel, DashboardMetricModel, DashboardSummaryModel, DoctorModel, SpecialtyDistributionModel, UpdateDoctorModel, LockUnlockAccountModel, ServiceModel, ReceptionistModel } from "../types";
import { doGetDashboardSummary, doGetTotalDoctors, doGetWeeklyBookingChart, doGetWeeklySpecialtyChart, doUpdateAccountStatus, doUpdateDoctorInfo, doCreateDoctorAccount, doGetServicesBySpecialty, doGetAllReceptionists, doCreateReceptionistAccount, doUpdateReceptionistInfo, doUpdateReceptionistAccountStatus } from "../api/dashboard";

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

async function UpdateDoctorInfor(formData: FormData) : Promise<boolean> {
    return await doUpdateDoctorInfo(formData)
}

async function UpdateAccountStatus(payload: LockUnlockAccountModel) {
    return await doUpdateAccountStatus(payload)
}

async function CreateDoctorAccount(formData: FormData) : Promise<boolean> {
    return await doCreateDoctorAccount(formData)
}

async function GetServicesBySpecialty(specialtyId: string) : Promise<ServiceModel[]> {
    return await doGetServicesBySpecialty(specialtyId)
}

async function GetAllReceptionists() : Promise<DashboardMetricModel<ReceptionistModel>> {
    return await doGetAllReceptionists()
}

async function CreateReceptionistAccount(formData: FormData) : Promise<boolean> {
    return await doCreateReceptionistAccount(formData)
}

async function LockUnlockAccount(payload: LockUnlockAccountModel) : Promise<boolean> {
    return await doUpdateReceptionistAccountStatus(payload)
}

async function UpdateReceptionistInfo(formData: FormData) : Promise<boolean> {
    return await doUpdateReceptionistInfo(formData)
}

export const useDashboardStore = () => ({
    GetDashboardSummary,    
    GetWeeklyBookingData,
    GetWeeklySpecialtyData,
    GetTotalDoctors,
    UpdateDoctorInfor,
    UpdateAccountStatus,
    CreateDoctorAccount,
    GetServicesBySpecialty,
    GetAllReceptionists,
    CreateReceptionistAccount,
    UpdateReceptionistInfo,
    LockUnlockAccount
})
