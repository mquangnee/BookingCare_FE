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
  Canceled = 4
}

export enum EnumAccountStatus {
  Active = 0,
  Inactive = 1
}

// === HELPER FUNCTIONS ===
export const getPositionName = (pos: EnumPosition): string => {
  switch (pos) {
    case EnumPosition.Doctor: return 'Bác sĩ';
    case EnumPosition.Master: return 'Thạc sĩ';
    case EnumPosition.DoctorOfPhilosophy: return 'Tiến sĩ';
    case EnumPosition.AssociateProfessor: return 'Phó Giáo sư';
    case EnumPosition.Professor: return 'Giáo sư';
    default: return 'Bác sĩ';
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