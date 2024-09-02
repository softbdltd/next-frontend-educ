import {Groupings} from './PermissionsManagementGroupings';

export const getGroupTitleKey = (group: string) => {
  switch (group) {
    case Groupings.USER_MANAGEMENT:
      return `permissions.${Groupings.USER_MANAGEMENT}`;
    case Groupings.INSTITUTE_MANAGEMENT:
      return `permissions.${Groupings.INSTITUTE_MANAGEMENT}`;
    case Groupings.ORGANIZATION_MANAGEMENT:
      return `permissions.${Groupings.ORGANIZATION_MANAGEMENT}`;
    case Groupings.INDUSTRY_ASSOCIATION_MANAGEMENT:
      return `permissions.${Groupings.INDUSTRY_ASSOCIATION_MANAGEMENT}`;
    case Groupings.EXAMS_MANAGEMENT:
      return `permissions.${Groupings.EXAMS_MANAGEMENT}`;
    case Groupings._4IR_MANAGEMENT:
      return `permissions.${Groupings._4IR_MANAGEMENT}`;
    case Groupings.RPL_MANAGEMENT:
      return `permissions.${Groupings.RPL_MANAGEMENT}`;
    case Groupings.CMS_MANAGEMENT:
      return `permissions.${Groupings.CMS_MANAGEMENT}`;
    case Groupings.APPRENTICESHIP_MANAGEMENT:
      return `permissions.${Groupings.APPRENTICESHIP_MANAGEMENT}`;
    case Groupings.OTHERS:
      return `permissions.${Groupings.OTHERS}`;

    default:
      return '';
  }
};
