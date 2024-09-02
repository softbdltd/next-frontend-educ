import {useIntl} from 'react-intl';
import React, {useCallback, useMemo, useState, useContext} from 'react';
import IconUser from '../../../@core/icons/IconUser';
import IntlMessages from '../../../@core/utility/IntlMessages';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import SkillDevelopmentReportDetailsPopup from './SkillDevelopmentReportDetailsPopup';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {Link} from '../../../@core/elements/common';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {API_SKILL_DEVELOPMENT_REPORT} from '../../../@core/common/apiRoutes';

const SkillDevelopmentReportPage = () => {
  const {messages} = useIntl();

  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const {training_center_report} =
    useContext<PermissionContextPropsType>(PermissionContext);

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
        headerName: messages['common.reporting_month'] as string,
        field: 'reporting_month',
        width: 250,
        filterable: true,
        dateRangeFilter: true,
        sortable: true,
      },
      {
        headerName: messages[
          'skill_development_report.last_election_date'
        ] as string,
        field: 'date_of_last_election_of_all_party_council',
        width: 250,
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
    urlPath: API_SKILL_DEVELOPMENT_REPORT,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconUser /> <IntlMessages id='skill_development_report.label' />
          </>
        }
        extra={[
          training_center_report.canCreate ? (
            <Link
              key={selectedItemId}
              href={'/training-center-reports/skill-development-report/create'}>
              <AddButton
                onClick={() => openDetailsModal(3)}
                isLoading={loading}
                tooltip={
                  <IntlMessages
                    id={'common.add_new'}
                    values={{
                      subject: messages['skill_development_report.label'],
                    }}
                  />
                }
              />
            </Link>
          ) : (
            ''
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
          <SkillDevelopmentReportDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default SkillDevelopmentReportPage;
