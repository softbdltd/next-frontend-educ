import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IconCourse from '../../../@core/icons/IconCourse';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import React from 'react';
import {useFetchSkillDevelopmentReport} from '../../../services/userManagement/hooks';

type IProps = {
  itemId: number | null;
  onClose: () => void;
};

const SkillDevelopmentReportDetailsPopup = ({itemId, ...props}: IProps) => {
  const {messages} = useIntl();

  const {data: itemData, isLoading} = useFetchSkillDevelopmentReport(itemId);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconCourse />
            <IntlMessages id='course.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container marginTop={'10px'} spacing={2} maxWidth={'md'}>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.reporting_month}
              label={messages['common.reporting_month']}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_trades_allowed}
              label={messages['skill_development_report.approved_trade_number']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_ongoing_trades}
              label={messages['skill_development_report.current_trade_number']}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px'}}>
                {messages['skill_development_report.current_session_trainees']}
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.current_session_trainees_women}
                    label={messages['skill_development_report.current_women']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.current_session_trainees_men}
                    label={messages['skill_development_report.current_men']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={
                      itemData?.current_session_trainees_disabled_and_others
                    }
                    label={
                      messages[
                        'skill_development_report.current_disabled_and_others'
                      ]
                    }
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.current_session_trainees_total}
                    label={messages['skill_development_report.current_total']}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px'}}>
                {messages['skill_development_report.trainees_from_the_start']}
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.total_trainees_women}
                    label={
                      messages['skill_development_report.from_start_women']
                    }
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.total_trainees_men}
                    label={messages['skill_development_report.from_start_men']}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.total_trainees_disabled_and_others}
                    label={
                      messages[
                        'skill_development_report.from_start_disabled_and_others'
                      ]
                    }
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.total_trainees_total}
                    label={
                      messages['skill_development_report.from_start_total']
                    }
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_computers}
              label={messages['skill_development_report.number_of_computers']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.number_of_other_equipments}
              label={messages['skill_development_report.number_of_machines']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend style={{fontSize: '20px'}}>
                {messages['skill_development_report.bank_static']}
              </legend>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.bank_status_skill_development}
                    label={
                      messages[
                        'skill_development_report.skill_improvement_training'
                      ]
                    }
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailsInputView
                    value={itemData?.bank_status_coordinating_council}
                    label={
                      messages[
                        'skill_development_report.coordinating_committee'
                      ]
                    }
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              value={itemData?.amount_of_total_fdr}
              label={messages['skill_development_report.total_fdr_amount']}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              value={itemData?.date_of_last_election_of_all_party_council}
              label={messages['skill_development_report.last_election_date']}
              isLoading={isLoading}
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

export default SkillDevelopmentReportDetailsPopup;
