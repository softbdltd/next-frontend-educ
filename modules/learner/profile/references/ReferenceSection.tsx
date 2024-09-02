import References from './References';
import React, { useCallback, useEffect, useState } from "react";
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {useFetchYouthReferences} from '../../../../services/learnerManagement/hooks';
import {deleteReference} from '../../../../services/learnerManagement/ReferenceService';
import ReferenceAddEditPage from './ReferenceAddEditPage';
import CustomParabolaButton from '../component/CustomParabolaButton';
import ContentLayout from '../component/ContentLayout';
import {Add} from '@mui/icons-material';
import HorizontalLine from '../component/HorizontalLine';
import {Avatar, Box} from '@mui/material';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import { styled } from "@mui/material/styles";
import { FormPopupNotifyEnum } from "../../../../shared/constants/AppEnums";
import { FORM_POPUP_CLOSE_OPEN_EL_ID } from "../../../../shared/constants/AppConst";

const PREFIX = 'ReferenceSection';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));
const ReferenceSection = () => {
  const {messages} = useIntl();
  const {successStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();
  const {
    data: references,
    isLoading,
    mutate: mutateReferences,
  } = useFetchYouthReferences();
  const [referenceId, setReferenceId] = useState<number | null>(null);
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);
  const [isOpenReferenceAddEditForm, setIsOpenReferenceAddEditForm] =
    useState<boolean>(false);

  useEffect(() => {
    if (focusEl !== FormPopupNotifyEnum.FOCUS_NONE) {
      let activeStepEl = document.getElementById(
        PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID,
      );
      if (activeStepEl) {
        activeStepEl.focus();
      }
    }
  }, [focusEl]);

  const openReferenceAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setReferenceId(itemId);
      setIsOpenReferenceAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );
  const closeReferenceAddEditForm = useCallback(() => {
    setReferenceId(null);
    setIsOpenReferenceAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    mutateReferences();
  }, []);

  const deleteReferenceItem = useCallback(async (itemId: number) => {
    let response = await deleteReference(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='reference.label' />}}
        />,
      );
      mutateReferences();
    }
  }, []);

  return <StyledBox>
    <span
      id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
      className={classes.visuallyHidden}
      tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}
    >
        {messages[`common.${focusEl}`]}
      </span>
    {isOpenReferenceAddEditForm ? (
    <ReferenceAddEditPage
      itemId={referenceId}
      onClose={closeReferenceAddEditForm}
    />
  ) : (
    <ContentLayout
      title={messages['reference.label']}
      isLoading={isLoading}
      actions={
        <CustomParabolaButton
          buttonVariant={'outlined'}
          title={messages['references.add_new_reference'] as string}
          aria-label={`${messages['references.add_new_reference']} form popup open`}
          icon={<Add />}
          onClick={() => openReferenceAddEditForm(null)}
          disabled={!Boolean(authUser?.nid_brn_verified_at)}
        />
      }>
      {!references || references?.length == 0 ? (
        <>
          <HorizontalLine />
          <Box sx={{display: 'flex'}}>
            <Avatar aria-hidden={true}>C</Avatar>
            <NoDataFoundComponent
              messageTextType={'inherit'}
              sx={{marginLeft: '15px', marginTop: '10px'}}
            />
          </Box>
        </>
      ) : (
        <References
          references={references}
          openReferenceAddEditForm={openReferenceAddEditForm}
          onDeleteReference={deleteReferenceItem}
          disabled={!Boolean(authUser?.nid_brn_verified_at)}
        />
      )}
    </ContentLayout>
  )}</StyledBox>
};

export default ReferenceSection;
