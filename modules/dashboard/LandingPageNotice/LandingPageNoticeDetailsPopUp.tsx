import React from 'react';
import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import IconDivision from '../../../@core/icons/IconDivision';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchLandingPageNoticePopup} from '../../../services/landingPageNoticeManagement/hooks';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const LandingPageNoticeDetailsPopUp = ({
  itemId,
  openEditModal,
  ...props
}: Props) => {
  const {data: itemData, isLoading} = useFetchLandingPageNoticePopup(itemId);
  const {messages, locale} = useIntl();

  console.log('itemData', itemData?.content);

  return (
    <>
      <CustomDetailsViewMuiModal
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        open={true}
        {...props}
        title={
          <>
            <IconDivision />
            <IntlMessages id='common.landing_page_notice' />
          </>
        }
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            <EditButton
              onClick={() => openEditModal(itemData?.id)}
              isLoading={isLoading}
            />
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['common.type']}
              value={itemData?.accessor_type}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['common.name']}
              value={
                locale == LocaleLanguage.EN
                  ? itemData?.title_en
                  : itemData?.title
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.content']}
              value={
                <div
                  dangerouslySetInnerHTML={{
                    __html: itemData?.content,
                  }}
                />
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <CustomChipRowStatus
              label={messages['common.with_background']}
              value={itemData?.with_background}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <CustomChipRowStatus
              label={messages['common.enabled']}
              value={itemData?.is_enabled}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default LandingPageNoticeDetailsPopUp;
