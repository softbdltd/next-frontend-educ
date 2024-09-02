import React from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconVisitorFeedback from '../../../@core/icons/IconVisitorFeedback';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useFetchVisitorFeedback} from '../../../services/cmsManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';

type Props = {
  itemId: number;
  onClose: () => void;
};

const VisitorDetailsPopup = ({itemId, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchVisitorFeedback(itemId);

  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        title={
          <>
            <IconVisitorFeedback />
            <IntlMessages id='visitor_feedback.label' />
          </>
        }
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.name']}
              value={itemData?.name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.mobile']}
              value={itemData?.mobile}
              isLoading={isLoading}
            />
          </Grid>
          {/*<Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.address']}
              value={itemData?.address}
              isLoading={isLoading}
            />
          </Grid>*/}
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.email']}
              value={itemData?.email}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <DetailsInputView
              label={messages['common.comment']}
              value={itemData?.comment}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.comment_en && (
            <Grid item xs={12} md={12}>
              <DetailsInputView
                label={messages['common.comment_en']}
                value={itemData?.comment_en}
                isLoading={isLoading}
              />
            </Grid>
          )}
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default VisitorDetailsPopup;
