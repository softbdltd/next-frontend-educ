export const ResultCodeDivisions = [
  'FIRST_DIVISION',
  'SECOND_DIVISION',
  'THIRD_DIVISION',
];

export const ResultCodeDivisionIds = ['1', '2', '3'];
export const ResultCodeGradeId = '4';
export const ResultCodeAppearedId = '5';

export const ResultCodeGrade = 'GRADE';
export const ResultCodeAppeared = 'APPEARED';
export const ResultCodeDoNotMention = 'DO_NOT_MENTION';
export const EducationLevelCodePHD = 'PHD';
export const OtherExamDegree = 'OTHERS';
export const OtherGroup = 'OTHERS_GROUP';
export const Others = 'Others';
export const DIPLOMABOARD = 'BTEB';

export const EducationLevelCodeWithGroup = [
  'SECONDARY',
  'HIGHER_SECONDARY',
  'DIPLOMA',
];

export const EducationLevelCodeWithBoard = [
  'PSC_5_PASS',
  'JSC_JDC_8_PASS',
  'SECONDARY',
  'HIGHER_SECONDARY',
];

export const EducationLevelForMajorGroup = [
  'DIPLOMA',
  'DEGREE',
  'BACHELOR',
  'MASTERS',
  'PHD',
];

export enum EducationLevel {
  PSC = 'PSC_5_PASS',
  JSC = 'JSC_JDC_8_PASS',
  SSC = 'SECONDARY',
  HSC = 'HIGHER_SECONDARY',
  DIPLOMA = 'DIPLOMA',
  HONOURS = 'BACHELOR',
  MASTERS = 'MASTERS',
  PHD = 'PHD',
}

export enum EducationLevelId {
  PSC = 1,
  JSC = 2,
  SSC = 3,
  HSC = 4,
  DIPLOMA = 5,
  HONOURS = 6,
  MASTERS = 7,
  PHD = 8,
}

export enum EducationLevelForSME {
  SSC = 1,
  HSC = 2,
  GRADUATIONS = 3,
  POST_GRADUATIONS = 4,
  OTHERS = 5,
}
