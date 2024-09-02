import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IconCourse from '../../../@core/icons/IconCourse';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import React from 'react';
import {useFetchTrainingCenterReportIncomeExpenditure} from '../../../services/instituteManagement/hooks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';

type IProps = {
  itemId: number | null;
  onClose: () => void;
};

const IncomeExpenditureReportDetailsPopup = ({itemId, ...props}: IProps) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();

  const {data: itemData, isLoading} =
    useFetchTrainingCenterReportIncomeExpenditure(itemId);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconCourse />
            <IntlMessages id='skills_development_training_activities_income_expenditure_information.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container marginTop={'10px'} spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.reporting_month}
              isLoading={isLoading}
              label={messages['common.month']}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.trade_name}
              isLoading={isLoading}
              label={
                messages[
                  'skills_development_training_activities_income_expenditure_information.trade_name'
                ]
              }
            />
          </Grid>
          {authUser?.isInstituteUser && !authUser?.isTrainingCenterUser && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  value={itemData?.training_center_title}
                  isLoading={isLoading}
                  label={messages['common.training_center_bn']}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  value={itemData?.training_center_title_en}
                  isLoading={isLoading}
                  label={messages['common.training_center_en']}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.number_of_labs_or_training_rooms}
              isLoading={isLoading}
              label={
                messages[
                  'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
                ]
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.number_of_allowed_seats}
              isLoading={isLoading}
              label={messages['training_center_report.number_of_seats_allowed']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.number_of_trainees}
              isLoading={isLoading}
              label={messages['training_center_report.number_of_trainees']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.course_fee_per_trainee}
              isLoading={isLoading}
              label={messages['training_center_report.course_fee_per_trainee']}
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                {messages['training_center_report.total_income_of_courses']}
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.course_income_from_course_fee}
                    isLoading={isLoading}
                    label={messages['training_center_report.total_course_fee']}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.course_income_from_application_and_others}
                    isLoading={isLoading}
                    label={
                      messages['training_center_report.application_and_others']
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.course_income_total}
                    isLoading={isLoading}
                    label={messages['training_center_report.total_income']}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.reporting_month_income}
              isLoading={isLoading}
              label={messages['training_center_report.reporting_month_income']}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.reporting_month_net_income}
              isLoading={isLoading}
              label={messages['training_center_report.month_net_income']}
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_report.net_training_expenses_reporting_month'
                  ]
                }
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={
                      itemData?.reporting_month_training_expenses_instructor_salaries
                    }
                    isLoading={isLoading}
                    label={
                      messages['training_center_report.instructor_salaries']
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.reporting_month_training_expenses_other}
                    isLoading={isLoading}
                    label={messages['training_center_report.other_expenses']}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.reporting_month_training_expenses_total}
                    isLoading={isLoading}
                    label={
                      messages['training_center_report.training_expenses_total']
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                {messages['training_center_report.bank_status']}
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.bank_status_up_to_previous_month}
                    isLoading={isLoading}
                    label={
                      messages[
                        'training_center_report.bank_status_up_to_previous_month'
                      ]
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    value={itemData?.bank_status_so_far}
                    isLoading={isLoading}
                    label={
                      messages['training_center_report.bank_status_so_far']
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.account_no_and_bank_branch_name}
              isLoading={isLoading}
              label={
                messages[
                  'training_center_report.account_no_and_bank_branch_name'
                ]
              }
            />
          </Grid>

          <Grid item xs={12}>
            <DetailsInputView
              value={itemData?.comments}
              label={messages['common.comment']}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default IncomeExpenditureReportDetailsPopup;
