import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconVisitorFeedback from '../../../@core/icons/IconVisitorFeedback';
import VisitorDetailsPopup from './VisitorDetailsPopup';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import {API_VISITOR_FEEDBACKS} from '../../../@core/common/apiRoutes';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Typography} from '@mui/material';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
const VisitorFeedbackPage = () => {
  const {messages, formatDate} = useIntl();
  const {visitor_feedback_suggestion: visitor_feedback_suggestion_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const {
    onFetchData,
    data: visitorFeedbacks,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_VISITOR_FEEDBACKS,
  });

  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const openDetailsModal = useCallback((itemId: number) => {
    setIsOpenDetailsModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.name'] as string,
        field: 'name',
        width: 250,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.comment'] as string,
        field: 'comment',
        width: 250,
      },
      {
        headerName: messages['common.mobile'] as string,
        field: 'mobile',
        width: 250,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.email'] as string,
        field: 'email',
        width: 250,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.address'] as string,
        field: 'address',
        width: 250,
        hide: true,
      },
      {
        headerName: messages['common.created'] as string,
        field: 'created_at',
        width: 200,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <Typography>
              {getIntlDateFromString(formatDate, data.created_at, 'short')}
            </Typography>
          );
        },
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 350,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {visitor_feedback_suggestion_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconVisitorFeedback /> <IntlMessages id='visitor_feedback.label' />
          </>
        }>
        <DataTable
          columns={columns}
          data={visitorFeedbacks || []}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
        />
        {isOpenDetailsModal && selectedItemId && (
          <VisitorDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default VisitorFeedbackPage;
