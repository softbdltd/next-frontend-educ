import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import SkillDetailsPopup from './SkillDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconSkill from '../../../@core/icons/IconSkill';
import InterviewChipRowStatus from './InterviewChipRowStatus';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {Download, Message} from '@mui/icons-material';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_SKILLS} from '../../../@core/common/apiRoutes';

const ApplicantListPage = () => {
  const {messages} = useIntl();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  const {
    onFetchData,
    data: applicantList,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_SKILLS,
  });

  const openDetailsModal = useCallback(
    (itemId: number) => {
      setIsOpenDetailsModal(true);
      setSelectedItemId(itemId);
    },
    [selectedItemId],
  );

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
        headerName: messages['common.post'] as string,
        field: 'position',
        hide: true,
        width: 250,
      },
      {
        headerName: messages['common.qualification'] as string,
        field: 'qualification',
        hide: true,
        width: 250,
      },
      {
        headerName: messages['common.experience'] as string,
        field: 'experience',
        hide: true,
        width: 250,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'applicant_status',
        hide: true,
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;
          return <InterviewChipRowStatus value={data?.applicant_status} />;
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
              <ReadButton onClick={() => openDetailsModal(data.id)} />
              <CommonButton
                onClick={() => console.log(data.id, data.course_id)}
                btnText='common.interview'
                startIcon={<Message style={{marginLeft: '5px'}} />}
                color='secondary'
              />
              <CommonButton
                onClick={() => console.log(data.id, data.course_id)}
                btnText='common.download'
                startIcon={<Download style={{marginLeft: '5px'}} />}
                color='primary'
              />
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
            <IconSkill /> <IntlMessages id='applicant.label' />
          </>
        }>
        <DataTable
          columns={columns}
          data={applicantList || []}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          showColumnToolbar={true}
        />

        {isOpenDetailsModal && selectedItemId && (
          <SkillDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default ApplicantListPage;
