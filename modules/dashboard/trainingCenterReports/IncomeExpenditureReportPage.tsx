import {useIntl} from 'react-intl';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import IconUser from '../../../@core/icons/IconUser';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {Link} from '../../../@core/elements/common';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {API_TRAINING_CENTERS_REPORTING_INCOME_EXPENDITURE} from '../../../@core/common/apiRoutes';
import IncomeExpenditureReportDetailsPopup from './IncomeExpenditureReportDetailsPopup';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';

const IncomeExpenditureReportPage = () => {
  const {messages, locale} = useIntl();
  const {training_center_report} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const authUser = useAuthUser<CommonAuthUser>();

  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const openDetailsModal = useCallback((itemId: number | null = null) => {
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
          'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
        ] as string,
        field: 'number_of_labs_or_training_rooms',
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
              <ReadButton onClick={() => openDetailsModal(data?.id)} />
            )
          );
        },
        sortable: false,
      },
    ],
    [messages],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_TRAINING_CENTERS_REPORTING_INCOME_EXPENDITURE,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconUser />{' '}
            <IntlMessages id='skills_development_training_activities_income_expenditure_information.label' />
          </>
        }
        extra={[
          training_center_report.canCreate &&
            authUser?.isTrainingCenterUser &&
            authUser?.isInstituteUser && (
              <Link
                key={1}
                href={
                  '/training-center-reports/income-expenditure-report/create'
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
          <IncomeExpenditureReportDetailsPopup
            key={selectedItemId}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default IncomeExpenditureReportPage;
