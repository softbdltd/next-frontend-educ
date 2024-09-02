import React from 'react';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconInstitute from '../../../@core/icons/IconInstitute';
import {useFetchCalendarEvent} from '../../../services/cmsManagement/hooks';
import {deleteEvent} from '../../../services/cmsManagement/EventService';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import EventCalendarDetails from './EventCalendarDetails';
import {ICalendar} from '../../../shared/Interface/common.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
  refreshDataTable: (events: string, item?: ICalendar | number) => void;
};

const EventCalendarDetailsPopup = ({
  itemId,
  openEditModal,
  refreshDataTable,
  ...props
}: Props) => {
  const {data: itemData, isLoading} = useFetchCalendarEvent(itemId);
  const {updateSuccessMessage} = useSuccessMessage();

  const onDelete = async () => {
    if (itemId) {
      await deleteEvent(itemId);
      updateSuccessMessage('menu.events');
      props.onClose();
      refreshDataTable('delete', itemId);
    }
  };

  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IconInstitute />
            <IntlMessages id='menu.calendar' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            <EditButton
              variant={'contained'}
              onClick={() => openEditModal(itemData.id)}
              isLoading={isLoading}
            />
            {itemId && (
              <ConfirmationButton
                buttonType={'delete'}
                confirmAction={onDelete}
              />
            )}
          </>
        }>
        {itemData && (
          <EventCalendarDetails itemData={itemData} isLoading={isLoading} />
        )}
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default EventCalendarDetailsPopup;
