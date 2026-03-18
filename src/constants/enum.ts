// === ENUMERATIONS ===
export enum EnumRelationship {
  MySelf = 0,
  Parent = 1,
  Child = 2,
  Sibling = 3,
  Spouse = 4,
  Grandparent = 5,
  Relative = 6,
  Friend = 7
}

export enum EnumBloodType {
  O_Positive = 0,
  O_Negative = 1,
  A_Positive = 2,
  A_Negative = 3,
  B_Positive = 4,
  B_Negative = 5,
  AB_Positive = 6,
  AB_Negative = 7,
  Unknown = 8
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