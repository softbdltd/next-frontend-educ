import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Grid} from '@mui/material';
import React, {FC} from 'react';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useFetchCombinedProgressReport} from '../../../services/instituteManagement/hooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useAuthUser} from '../../../@core/utility/AppHooks';

interface ProgressReportDetailsPopupProps {
  itemId: number | null;
  onClose: () => void;
}

const CombinedProgressReportDetailsPopup: FC<
  ProgressReportDetailsPopupProps
> = ({itemId, onClose, ...props}) => {
  const {messages, formatDate} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();

  const {data: itemData, isLoading: isLoading} =
    useFetchCombinedProgressReport(itemId);

  const getIntlDateFromString = (formatFn: any, dateStr: any) => {
    const dt = new Date(dateStr).toLocaleString();
    if (dt !== 'Invalid Date') {
      return formatFn(dateStr, {
        month: 'long',
        year: 'numeric',
      });
    } else {
      return dateStr;
    }
  };

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        onClose={onClose}
        {...props}
        title={
          <>
            <AssignmentTurnedInIcon />
            <IntlMessages id='training_center_progress_report_combined.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container marginTop={'10px'} spacing={2}>
          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={getIntlDateFromString(
                formatDate,
                itemData?.reporting_month,
              )}
              label={messages['common.reporting_month']}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={
                itemData?.voluntary_organizations_registered_in_current_month
              }
              label={
                messages[
                  'training_center_progress_report.voluntary_organizations_registered_in_current_month'
                ]
              }
            />
          </Grid>
          {authUser?.isInstituteUser && !authUser?.isTrainingCenterUser && (
            <>
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  value={itemData?.training_center_title}
                  isLoading={isLoading}
                  label={messages['common.training_center']}
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

          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.members_up_to_previous_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.members_up_to_previous_month_general_members
                    }
                    label={
                      messages[
                        'training_center_progress_report.general_members'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.members_up_to_previous_month_life_member}
                    label={
                      messages[
                        'training_center_progress_report.lifetime_members'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.members_up_to_previous_month_patron_member}
                    label={
                      messages['training_center_progress_report.patron_members']
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.members_up_to_previous_month_total}
                    label={
                      messages['training_center_progress_report.total_members']
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.members_enrollment_in_reporting_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.member_enrollment_in_reporting_month_general_members
                    }
                    label={
                      messages[
                        'training_center_progress_report.general_members'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.member_enrollment_in_reporting_month_life_member
                    }
                    label={
                      messages[
                        'training_center_progress_report.lifetime_members'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.member_enrollment_in_reporting_month_patron_member
                    }
                    label={
                      messages['training_center_progress_report.patron_members']
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.member_enrollment_in_reporting_month_total}
                    label={
                      messages['training_center_progress_report.total_members']
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.total_number_of_members}
              label={messages['training_center_progress_report.total_members']}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.subscriptions_collected_so_far}
              label={
                messages[
                  'training_center_progress_report.subscriptions_collected_so_far'
                ]
              }
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.total_amount_of_subscription_in_current_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.subscriptions_collected_in_current_month_organization
                    }
                    label={
                      messages[
                        'training_center_progress_report.subscriptions_collected_from_organization'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.subscriptions_collected_in_current_month_member
                    }
                    label={
                      messages[
                        'training_center_progress_report.subscriptions_collected_from_member'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.subscriptions_collected_in_current_month_total
                    }
                    label={
                      messages[
                        'training_center_progress_report.total_subscription'
                      ]
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.amount_of_grants_received_in_current_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.grants_received_in_current_month_source}
                    label={messages['training_center_progress_report.source']}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.grants_received_in_current_month_amount}
                    label={messages['common.amount']}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.grants_received_in_current_month_total}
                    label={
                      messages['training_center_progress_report.total_grants']
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.gross_income}
              label={messages['training_center_progress_report.gross_income']}
            />
          </Grid>
          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.income_in_skill_development_sector_in_reported_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.income_in_skills_development_sector_trades}
                    label={
                      messages[
                        'training_center_progress_report.number_of_trades'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.income_in_skills_development_sector_money}
                    label={
                      messages[
                        'training_center_progress_report.amount_of_money'
                      ]
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.expenditure_in_reported_month'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.expenditure_in_skill_development_training}
                    label={
                      messages[
                        'training_center_progress_report.expenditure_in_skill_development_training'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.expenditure_in_other_sectors}
                    label={
                      messages[
                        'training_center_progress_report.expenditure_in_other_sectors'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.expenditure_total}
                    label={
                      messages[
                        'training_center_progress_report.expenditure_total'
                      ]
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.total_income_in_the_training_sector}
              label={
                messages[
                  'training_center_progress_report.total_income_in_the_training_sector'
                ]
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.bank_status_and_account_number}
              label={
                messages[
                  'training_center_progress_report.bank_status_and_account_number'
                ]
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.bank_interest}
              label={messages['training_center_progress_report.bank_interest']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.amount_of_fdr_and_bank_account_number}
              label={
                messages[
                  'training_center_progress_report.amount_of_fdr_and_bank_account_number'
                ]
              }
            />
          </Grid>
          <Grid item xs={12}>
            <fieldset style={{border: '1px solid #7e7e7e'}}>
              <legend style={{color: '#0a8fdc'}}>
                {
                  messages[
                    'training_center_progress_report.information_about_coordinating_council_combined_meeting'
                  ]
                }
              </legend>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.number_of_meetings_held_during_current_financial_year
                    }
                    label={
                      messages[
                        'training_center_progress_report.number_of_meetings_held_during_current_financial_year'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={
                      itemData?.number_of_executive_council_meetings_in_current_month
                    }
                    label={
                      messages[
                        'training_center_progress_report.number_of_executive_council_meetings_in_current_month'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.coordinating_council_meeting_total}
                    label={
                      messages[
                        'training_center_progress_report.coordinating_council_meeting_total'
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    isLoading={isLoading}
                    value={itemData?.names_and_numbers_of_other_meetings}
                    label={
                      messages[
                        'training_center_progress_report.names_and_numbers_of_other_meetings'
                      ]
                    }
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <DetailsInputView
              isLoading={isLoading}
              value={itemData?.other_activities_undertaken}
              label={
                messages[
                  'training_center_progress_report.other_activities_undertaken'
                ]
              }
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default CombinedProgressReportDetailsPopup;
