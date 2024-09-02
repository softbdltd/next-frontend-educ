import React from 'react';
import {Grid} from '@mui/material';
import IconCourse from '../../../@core/icons/IconCourse';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchTrainingCenterProgressReport} from '../../../services/instituteManagement/hooks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';

type Props = {
  itemId: number | null;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const SkillDevelopmentMonthlyProgressReportDetailsPopup = ({
  itemId,
  openEditModal,
  ...props
}: Props) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const {data: itemData, isLoading} =
    useFetchTrainingCenterProgressReport(itemId);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconCourse />
            <IntlMessages id='skill_development_monthly_progress_report.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container marginTop={'10px'} spacing={2}>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.reporting_month}
              label={messages['common.reporting_month']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.trade_name}
              label={
                messages[
                  'skills_development_training_activities_income_expenditure_information.trade_name'
                ]
              }
              isLoading={isLoading}
            />
          </Grid>

          {authUser?.isInstituteUser && !authUser?.isTrainingCenterUser && (
            <>
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  value={itemData?.training_center_title}
                  isLoading={isLoading}
                  label={messages['common.training_center_bn']}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  value={itemData?.training_center_title_en}
                  isLoading={isLoading}
                  label={messages['common.training_center_en']}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_trainers}
              label={messages['dashboard.total_trainers']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_labs_or_training_rooms}
              label={
                messages[
                  'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
                ]
              }
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_computers_or_training_equipments}
              label={
                messages[
                  'skill_development_monthly_progress_report.number_of_computers_or_training_equipments'
                ]
              }
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'skill_development_monthly_progress_report.admitted_trainee'
                  ]
                }
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_men}
                    label={messages['common.male']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_women}
                    label={messages['common.female']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_disabled}
                    label={messages['common.disability']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_qawmi}
                    label={messages['common.qawmi']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_transgender}
                    label={messages['common.transgender']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_others}
                    label={messages['common.others']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.admitted_trainee_total}
                    label={messages['common.total']}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'skill_development_monthly_progress_report.technical_board_registered_trainee'
                  ]
                }
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.technical_board_registered_trainee_men}
                    label={messages['common.male']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.technical_board_registered_trainee_women}
                    label={messages['common.female']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={
                      itemData?.technical_board_registered_trainee_disabled
                    }
                    label={messages['common.disability']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.technical_board_registered_trainee_qawmi}
                    label={messages['common.qawmi']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={
                      itemData?.technical_board_registered_trainee_transgender
                    }
                    label={messages['common.transgender']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.technical_board_registered_trainee_others}
                    label={messages['common.others']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.technical_board_registered_trainee_total}
                    label={messages['common.total']}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'skill_development_monthly_progress_report.latest_test_attended_trainee'
                  ]
                }
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_men}
                    label={messages['common.male']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_women}
                    label={messages['common.female']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_disabled}
                    label={messages['common.disability']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_qawmi}
                    label={messages['common.qawmi']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_transgender}
                    label={messages['common.transgender']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_others}
                    label={messages['common.others']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_attended_trainee_total}
                    label={messages['common.total']}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'skill_development_monthly_progress_report.latest_test_passed_trainee'
                  ]
                }
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_men}
                    label={messages['common.male']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_women}
                    label={messages['common.female']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_disabled}
                    label={messages['common.disability']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_qawmi}
                    label={messages['common.qawmi']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_transgender}
                    label={messages['common.transgender']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_others}
                    label={messages['common.others']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.latest_test_passed_trainee_total}
                    label={messages['common.total']}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default SkillDevelopmentMonthlyProgressReportDetailsPopup;
