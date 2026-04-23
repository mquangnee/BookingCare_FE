// === ENUMERATIONS ===
export enum EnumRelationship {
  MySelf = 0,
  Parent = 1,
  Child = 2,
  Sibling = 3,
  Spouse = 4,
  Grandparent = 5
}

export enum EnumBloodType {
  Unknown = 0,
  O_Positive = 1,
  O_Negative = 2,
  A_Positive = 3,
  A_Negative = 4,
  B_Positive = 5,
  B_Negative = 6,
  AB_Positive = 7,
  AB_Negative = 8
}

export enum EnumGender {
  Male = 0,
  Female = 1,
  Others = 2
}

export enum EnumSenderTemplate {
  SendOtpRegister = 0,
  SendOtpVerifyPassword = 1,
}

export enum EnumPosition {
  Doctor = 0,
  Master = 1,
  DoctorOfPhilosophy = 2,
  AssociateProfessor = 3,
  Professor = 4
}

export enum EnumShareStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2
}

export enum EnumSharePermission {
  ReadOnly = 0,
  BookAppointment = 1,
  FullAccess = 2
}

export enum EnumNotificationType {
  SystemAlert = 0,
  AppointmentReminder = 1,
  AppointmentConfirmed = 2,
  AppointmentCanceled = 3,
  ShareProfileInvite = 4,
  ShareProfileAccepted = 5,
  ShareProfileRejected = 6,
  ShareProfileRevoked = 7
}

export enum EnumAppointmentStatus {
  Pending = 0,
  Approved = 1,
  InProgress = 2,
  Completed = 3,
  Canceled = 4,
  Waiting = 5,
  NoShow = 6
}

export enum EnumAccountStatus {
  Active = 0,
  Inactive = 1
}

export enum EnumMedicineUnit {
  Tablet = 0, //viên
  Blister = 1, //vỉ
  Box = 2, //hộp
  Bottle = 3, //chai
  Vial = 4, //lọ
  Ampule = 5, //ống tiêm
  Sachet = 6, //gói
  Tube = 7 //tuýp
}

export enum EnumStatus {
  Active = 0,
  Inactive = 1
}

export enum EnumAppointmentPriority
{
  Level0 = 0, //Mặc định
  Level1 = 1, //Dành cho bệnh nhân đến đúng giờ
  Level2 = 2, //Dành cho bệnh nhân đặt lịch offline
  Level3 = 3  //Dành cho bệnh nhân đến muộn
}

export enum EnumAppointmentType
{
  Online = 0,
  Offline = 1
}

// === HELPER FUNCTIONS ===
export const getGenderName = (gender: EnumGender): string => {
  switch (gender) {
    case EnumGender.Male: return 'Nam';
    case EnumGender.Female: return 'Nữ';
    case EnumGender.Others: return 'Khác';
    default: return 'Khác';
  }
}

export const getPositionName = (pos: EnumPosition): string => {
  switch (pos) {
    case EnumPosition.Doctor: return 'BS.';
    case EnumPosition.Master: return 'Ths.';
    case EnumPosition.DoctorOfPhilosophy: return 'TS.';
    case EnumPosition.AssociateProfessor: return 'PGS.TS';
    case EnumPosition.Professor: return 'GS.TS';
    default: return 'BS.';
  }
}

export const getSharePermissionName = (permission: EnumSharePermission): string => {
  switch (permission) {
    case EnumSharePermission.ReadOnly: return 'Chỉ xem';
    case EnumSharePermission.BookAppointment: return 'Đặt lịch hẹn';
    case EnumSharePermission.FullAccess: return 'Toàn quyền';
    default: return 'Chỉ xem';
  }
}

export const getRelationshipName = (relationship: EnumRelationship): string => {
  switch (relationship) {
    case EnumRelationship.MySelf: return 'Bản thân';
    case EnumRelationship.Parent: return 'Cha/Mẹ';
    case EnumRelationship.Child: return 'Con cái';
    case EnumRelationship.Sibling: return 'Anh/Chị em';
    case EnumRelationship.Spouse: return 'Vợ/Chồng';
    case EnumRelationship.Grandparent: return 'Ông/Bà';
    default: return 'Bản thân';
  }
}

export const getAccountStatusName = (status: EnumAccountStatus): string => {
  switch (status) {
    case EnumAccountStatus.Active: return 'Đang hoạt động';
    case EnumAccountStatus.Inactive: return 'Đã khóa';
    default: return 'Đang hoạt động';
  }
}

export const getAppointmentStatusName = (status: EnumAppointmentStatus): string => {
  switch (status) {
    case EnumAppointmentStatus.Pending: return 'Chờ duyệt';
    case EnumAppointmentStatus.Approved: return 'Chờ check-in';
    case EnumAppointmentStatus.Waiting: return 'Đã check-in';
    case EnumAppointmentStatus.InProgress: return 'Đang khám';
    case EnumAppointmentStatus.Completed: return 'Hoàn thành';
    case EnumAppointmentStatus.Canceled: return 'Hủy/Vắng';
    case EnumAppointmentStatus.NoShow: return 'Vắng mặt';
    default: return 'Unknown';
  }
}

export const getAppointmentTypeName = (type: EnumAppointmentType): string => {
  switch (type) {
    case EnumAppointmentType.Online: return 'Đặt trước';
    case EnumAppointmentType.Offline: return 'Vãng lai';
    default: return 'Đặt trước';
  }
}

export const getMedicineUnitName = (unit: EnumMedicineUnit): string => {
  switch (unit) {
    case EnumMedicineUnit.Tablet: return 'Viên';
    case EnumMedicineUnit.Blister: return 'Vỉ';
    case EnumMedicineUnit.Box: return 'Hộp';
    case EnumMedicineUnit.Bottle: return 'Chai';
    case EnumMedicineUnit.Vial: return 'Lọ';
    case EnumMedicineUnit.Ampule: return 'Ống tiêm';
    case EnumMedicineUnit.Sachet: return 'Gói';
    case EnumMedicineUnit.Tube: return 'Tuýp';
    default: return '';
  }
}