import {useIntl} from 'react-intl';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import IconUser from '../../../@core/icons/IconUser';
import IntlMessages from '../../../@core/utility/IntlMessages';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import SkillDevelopmentMonthlyProgressReportDetailsPopup from './MonthlyProgressReportDetailsPopup';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {Link} from '../../../@core/elements/common';
import {API_TRAINING_CENTERS_REPORTING_PROGRESS} from '../../../@core/common/apiRoutes';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';

const MonthlyProgressReportPage = () => {
  const {messages, locale} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const {training_center_report} =
    useContext<PermissionContextPropsType>(PermissionContext);

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
        headerName: messages[
          'skills_development_training_activities_income_expenditure_information.trade_name'
        ] as string,
        field: 'trade_name',
        width: 250,
        filterable: true,
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
        headerName: messages['dashboard.total_trainers'] as string,
        field: 'number_of_trainers',
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
            training_center_report.canRead && (
              <ReadButton onClick={() => openDetailsModal(data.id)} />
            )
          );
        },
        sortable: false,
      },
    ],
    [messages],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_TRAINING_CENTERS_REPORTING_PROGRESS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconUser />{' '}
            <IntlMessages id='skill_development_monthly_progress_report.label' />
          </>
        }
        extra={[
          training_center_report.canCreate &&
            authUser?.isTrainingCenterUser &&
            authUser?.isInstituteUser && (
              <Link
                key={selectedItemId}
                href={
                  '/training-center-reports/monthly-progress-report/create'
                }>
                <AddButton
                  onClick={() => {}}
                  isLoading={loading}
                  tooltip={
                    <IntlMessages
                      id={'common.add_new'}
                      values={{
                        subject:
                          messages[
                            'skills_development_training_activities_income_expenditure_information.label'
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
          <SkillDevelopmentMonthlyProgressReportDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default MonthlyProgressReportPage;
