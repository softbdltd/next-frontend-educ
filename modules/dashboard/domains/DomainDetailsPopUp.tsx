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
import {useFetchDomain} from '../../../services/domainManagement/hooks';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const DomainDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {data: itemData, isLoading} = useFetchDomain(itemId);
  const {messages} = useIntl();

  return (
    <>
      <CustomDetailsViewMuiModal
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        open={true}
        {...props}
        title={
          <>
            <IconDivision />
            <IntlMessages id='common.domain' />
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
          <Grid item xs={12} md={12}>
            <DetailsInputView
              label={messages['common.domain']}
              value={itemData?.domain}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['common.title_prefix']}
              value={itemData?.title_prefix}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['common.title_prefix_en']}
              value={itemData?.title_prefix_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['institute.label']}
              value={itemData?.institute_id}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['organization.label']}
              value={itemData?.organization_id}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['industry_association.label']}
              value={itemData?.industry_association_id}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <DetailsInputView
              label={messages['ministry.label']}
              value={itemData?.ministry_id}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default DomainDetailsPopup;
