import yup from '../../../@core/libs/yup';

const monthlyProgressReportValidationSchema = (messages: any) => {
  return yup.object().shape({
    reporting_month: yup
      .string()
      .nullable()
      .required()
      .label(messages['common.reporting_month'] as string),
    trade_name: yup
      .string()
      .nullable()
      .required()
      .label(
        messages[
          'skills_development_training_activities_income_expenditure_information.trade_name'
        ] as string,
      ),
    number_of_trainers: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['dashboard.total_trainers'] as string),
    number_of_labs_or_training_rooms: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(
        messages[
          'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
        ] as string,
      ),
    number_of_computers_or_training_equipments: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(
        messages[
          'skill_development_monthly_progress_report.number_of_computers_or_training_equipments'
        ] as string,
      ),
    admitted_trainee_men: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.male'] as string),
    admitted_trainee_women: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.female'] as string),
    admitted_trainee_disabled: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.disability'] as string),
    admitted_trainee_qawmi: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.qawmi'] as string),
    admitted_trainee_transgender: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.transgender'] as string),
    admitted_trainee_others: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.others'] as string),
    admitted_trainee_total: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.total'] as string),
    technical_board_registered_trainee_men: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.male'] as string),
    technical_board_registered_trainee_women: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.female'] as string),
    technical_board_registered_trainee_disabled: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.disability'] as string),
    technical_board_registered_trainee_qawmi: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.qawmi'] as string),
    technical_board_registered_trainee_transgender: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.transgender'] as string),
    technical_board_registered_trainee_others: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.others'] as string),
    technical_board_registered_trainee_total: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.total'] as string),
    latest_test_attended_trainee_men: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.male'] as string),
    latest_test_attended_trainee_women: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.female'] as string),
    latest_test_attended_trainee_disabled: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.disability'] as string),
    latest_test_attended_trainee_qawmi: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.qawmi'] as string),
    latest_test_attended_trainee_transgender: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.transgender'] as string),
    latest_test_attended_trainee_others: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.others'] as string),
    latest_test_attended_trainee_total: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.total'] as string),
    latest_test_passed_trainee_men: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.male'] as string),
    latest_test_passed_trainee_women: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.female'] as string),
    latest_test_passed_trainee_disabled: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.disability'] as string),
    latest_test_passed_trainee_qawmi: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.qawmi'] as string),
    latest_test_passed_trainee_transgender: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.transgender'] as string),
    latest_test_passed_trainee_others: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.others'] as string),
    latest_test_passed_trainee_total: yup
      .number()
      .required()
      .min(0)
      .required()
      .label(messages['common.total'] as string),
  });
};

export default monthlyProgressReportValidationSchema;
