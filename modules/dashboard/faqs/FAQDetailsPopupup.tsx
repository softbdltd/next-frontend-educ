import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconFAQ from '../../../@core/icons/IconFAQ';
import {
  useFetchCMSGlobalConfig,
  useFetchFAQ,
} from '../../../services/cmsManagement/hooks';
import {getLanguageLabel} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const FAQDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchFAQ(itemId);

  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const {faq: faq_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IconFAQ />
            <IntlMessages id='menu.faq' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />

            {faq_permissions.canUpdate && (
              <EditButton
                variant={'contained'}
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.show_in']}
              value={itemData?.show_in_label}
              isLoading={isLoading}
            />
          </Grid>

          {itemData?.show_in && itemData.show_in == ShowInTypes.TSP && (
            <Grid item xs={12} md={6}>
              <DetailsInputView
                label={messages['common.institute_name']}
                value={itemData?.institute_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData?.show_in && itemData.show_in == ShowInTypes.INDUSTRY && (
            <Grid item xs={12} md={6}>
              <DetailsInputView
                label={messages['organization.label']}
                value={itemData?.organization_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData?.show_in &&
            itemData.show_in == ShowInTypes.INDUSTRY_ASSOCIATION && (
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  label={messages['common.industry_association']}
                  value={itemData?.industry_association_title}
                  isLoading={isLoading}
                />
              </Grid>
            )}

          {itemData?.show_in && itemData.show_in == ShowInTypes.MINISTRY && (
            <Grid item xs={12} md={6}>
              <DetailsInputView
                label={messages['common.ministry']}
                value={itemData?.ministry_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <fieldset>
              <legend>
                {getLanguageLabel(
                  cmsGlobalConfig?.language_configs,
                  LanguageCodes.BANGLA,
                )}
              </legend>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <DetailsInputView
                    label={messages['faq.question']}
                    value={itemData?.question}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    label={messages['faq.answer']}
                    value={itemData?.answer}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          {Object.keys(itemData?.other_language_fields || {}).map(
            (key: string) => (
              <Grid item xs={12} md={12} key={key}>
                <fieldset>
                  <legend>
                    {getLanguageLabel(cmsGlobalConfig?.language_configs, key)}
                  </legend>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <DetailsInputView
                        label={messages['faq.question']}
                        value={itemData?.other_language_fields[key].question}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailsInputView
                        label={messages['faq.answer']}
                        value={itemData?.other_language_fields[key].answer}
                        isLoading={isLoading}
                      />
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
            ),
          )}
          <Grid item xs={12}>
            <CustomChipRowStatus
              label={messages['common.status']}
              value={itemData?.row_status}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default FAQDetailsPopup;
