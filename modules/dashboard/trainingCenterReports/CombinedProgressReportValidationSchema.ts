import yup from '../../../@core/libs/yup';

const CombinedProgressReportValidationSchema = (messages: any) => {
  return yup.object().shape({
    reporting_month: yup
      .string()
      .required()
      .label(messages['common.reporting_month'] as string),
    voluntary_organizations_registered_in_current_month: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.voluntary_organizations_registered_in_current_month'
        ] as string,
      ),
    members_up_to_previous_month_general_members: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.general_members'] as string,
      ),
    members_up_to_previous_month_life_member: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.lifetime_members'] as string,
      ),
    members_up_to_previous_month_patron_member: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.patron_members'] as string,
      ),
    members_up_to_previous_month_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.total_members'] as string,
      ),
    member_enrollment_in_reporting_month_general_members: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.general_members'] as string,
      ),
    member_enrollment_in_reporting_month_life_member: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.lifetime_members'] as string,
      ),
    member_enrollment_in_reporting_month_patron_member: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.patron_members'] as string,
      ),
    member_enrollment_in_reporting_month_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.total_members'] as string,
      ),
    total_number_of_members: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.total_members'] as string,
      ),
    subscriptions_collected_so_far: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.subscriptions_collected_so_far'
        ] as string,
      ),
    subscriptions_collected_in_current_month_organization: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.subscriptions_collected_from_organization'
        ] as string,
      ),
    subscriptions_collected_in_current_month_member: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.subscriptions_collected_from_member'
        ] as string,
      ),
    subscriptions_collected_in_current_month_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.total_subscription'
        ] as string,
      ),
    grants_received_in_current_month_source: yup
      .string()
      .trim()
      .required()
      .label(messages['training_center_progress_report.source'] as string),
    grants_received_in_current_month_amount: yup
      .number()
      .required()
      .min(0)
      .label(messages['common.amount'] as string),
    grants_received_in_current_month_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.total_grants'] as string,
      ),
    gross_income: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.gross_income'] as string,
      ),
    income_in_skills_development_sector_trades: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.number_of_trades'] as string,
      ),
    income_in_skills_development_sector_money: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.amount_of_money'] as string,
      ),
    expenditure_in_skill_development_training: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.expenditure_in_skill_development_training'
        ] as string,
      ),
    expenditure_in_other_sectors: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.expenditure_in_other_sectors'
        ] as string,
      ),
    expenditure_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.expenditure_total'] as string,
      ),
    bank_status_and_account_number: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_progress_report.bank_status_and_account_number'
        ] as string,
      ),
    total_income_in_the_training_sector: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.total_income_in_the_training_sector'
        ] as string,
      ),
    bank_interest: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_progress_report.bank_interest'] as string,
      ),
    amount_of_fdr_and_bank_account_number: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_progress_report.amount_of_fdr_and_bank_account_number'
        ] as string,
      ),
    number_of_meetings_held_during_current_financial_year: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.number_of_meetings_held_during_current_financial_year'
        ] as string,
      ),
    names_and_numbers_of_other_meetings: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_progress_report.names_and_numbers_of_other_meetings'
        ] as string,
      ),
    number_of_executive_council_meetings_in_current_month: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.number_of_executive_council_meetings_in_current_month'
        ] as string,
      ),
    coordinating_council_meeting_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages[
          'training_center_progress_report.coordinating_council_meeting_total'
        ] as string,
      ),
    other_activities_undertaken: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_progress_report.other_activities_undertaken'
        ] as string,
      ),
  });
};

export default CombinedProgressReportValidationSchema;
