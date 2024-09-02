import yup from '../../../@core/libs/yup';

const incomeExpenditureReportValidationSchema = (messages: any) => {
  return yup.object().shape({
    reporting_month: yup
      .string()
      .nullable()
      .required()
      .label(messages['common.reporting_month'] as string),
    trade_name: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'skills_development_training_activities_income_expenditure_information.trade_name'
        ] as string,
      ),
    number_of_labs_or_training_rooms: yup
      .number()
      .required()
      .positive(messages['common.positive'] as string)
      .label(
        messages[
          'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
        ] as string,
      ),
    number_of_allowed_seats: yup
      .number()
      .required()
      .positive(messages['common.positive'] as string)
      .label(
        messages['training_center_report.number_of_seats_allowed'] as string,
      ),
    number_of_trainees: yup
      .number()
      .required()
      .min(0)
      // .positive(messages['common.positive'] as string)
      .label(messages['training_center_report.number_of_trainees'] as string),
    course_fee_per_trainee: yup
      .number()
      .required()
      .min(0)
      .label(messages['training_center_report.total_course_fee'] as string),
    course_income_from_course_fee: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_report.course_fee_per_trainee'] as string,
      ),
    course_income_from_application_and_others: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_report.application_and_others'] as string,
      ),
    course_income_total: yup
      .number()
      .required()
      .min(0)
      .label(messages['training_center_report.total_income'] as string),
    reporting_month_income: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_report.reporting_month_income'] as string,
      ),
    reporting_month_training_expenses_instructor_salaries: yup
      .number()
      .required()
      .min(0)
      .label(messages['training_center_report.instructor_salaries'] as string),
    reporting_month_training_expenses_other: yup
      .number()
      .required()
      .min(0)
      .label(messages['training_center_report.other_expenses'] as string),
    reporting_month_training_expenses_total: yup
      .number()
      .required()
      .min(0)
      .label(
        messages['training_center_report.training_expenses_total'] as string,
      ),
    reporting_month_net_income: yup
      .number()
      .required()
      .label(messages['training_center_report.month_net_income'] as string),

    bank_status_up_to_previous_month: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_report.bank_status_up_to_previous_month'
        ] as string,
      ),
    bank_status_so_far: yup
      .string()
      .trim()
      .required()
      .label(messages['training_center_report.bank_status_so_far'] as string),
    account_no_and_bank_branch_name: yup
      .string()
      .trim()
      .required()
      .label(
        messages[
          'training_center_report.account_no_and_bank_branch_name'
        ] as string,
      ),

    comments: yup
      .string()
      .trim()
      .required()
      .label(messages['common.comment'] as string),
  });
};

export default incomeExpenditureReportValidationSchema;
