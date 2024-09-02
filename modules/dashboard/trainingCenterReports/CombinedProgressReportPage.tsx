import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {Link} from '../../../@core/elements/common';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CombinedProgressReportDetailsPopup from './CombinedProgressReportDetailsPopup';
import {API_TRAINING_CENTERS_REPORTING_COMBINED_PROGRESS} from '../../../@core/common/apiRoutes';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';

const CombinedProgressReportPage = () => {
  const {messages, locale} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const {training_center_report} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [itemId, setItemId] = useState<number | null>(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  const openDetailsModal = useCallback(
    (itemId: number) => {
      setIsOpenDetailsModal(true);
      setItemId(itemId);
    },
    [itemId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages[
          'training_center_progress_report.total_members'
        ] as string,
        field: 'total_number_of_members',
        width: 250,
        sortable: true,
      },
      {
        headerName: messages['common.training_center_bn'] as string,
        field: 'training_center_title',
        width: 250,
        sortable: true,
        hide:
          locale == LocaleLanguage.EN ||
          (authUser?.isInstituteUser && authUser?.isTrainingCenterUser),
      },
      {
        headerName: messages['common.training_center_en'] as string,
        field: 'training_center_title_en',
        width: 250,
        sortable: true,
        hide:
          locale == LocaleLanguage.BN ||
          (authUser?.isInstituteUser && authUser?.isTrainingCenterUser),
      },

      {
        headerName: messages[
          'training_center_progress_report.subscriptions_collected_so_far'
        ] as string,
        field: 'subscriptions_collected_so_far',
        width: 250,
        sortable: true,
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {training_center_report.canRead && (
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

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_TRAINING_CENTERS_REPORTING_COMBINED_PROGRESS,
  });
  return (
    <>
      <PageContentBlock
        title={
          <>
            <AssignmentTurnedInIcon />{' '}
            <IntlMessages id='training_center_progress_report_combined.label' />
          </>
        }
        extra={[
          training_center_report.canCreate &&
            authUser?.isTrainingCenterUser &&
            authUser?.isInstituteUser && (
              <Link
                key={1}
                href={
                  '/training-center-reports/combined-progress-report/create'
                }>
                <AddButton
                  onClick={() => {}}
                  key={1}
                  // isLoading={loading}
                  tooltip={
                    <IntlMessages
                      id={'common.add_new'}
                      values={{
                        subject:
                          messages[
                            'training_center_progress_report_combined.label'
                          ],
                      }}
                    />
                  }
                />
              </Link>
            ),
        ]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          showColumnToolbar={true}
        />

        {isOpenDetailsModal && (
          <CombinedProgressReportDetailsPopup
            key={1}
            itemId={itemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default CombinedProgressReportPage;
