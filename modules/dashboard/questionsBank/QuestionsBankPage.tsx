import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {deleteQuestionsBank} from '../../../services/instituteManagement/QuestionsBankService';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {
  API_EXAM_QUESTION_BANK,
  API_EXAM_SUBJECTS,
} from '../../../@core/common/apiRoutes';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import QuestionsBankDetailsPopup from './QuestionsBankDetailsPopup';
import IconQuestion from '../../../@core/icons/IconQuestion';
import {QuestionType} from './QuestionBanksEnums';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import DownloadIcon from '@mui/icons-material/Download';
import ImportQuestionPopup from './ImportQuestionPopup';
import QuestionsBankEditPopup from './QuestionsBankEditPopup';
import QuestionsBankAddPopup from './QuestionsBankAddPopup';

const QuestionsBankPage = () => {
  const {messages, locale} = useIntl();
  const {successStack} = useNotiStack();
  const {
    exam_question_bank: exam_question_bank_permissions,
    other_permissions,
  } = useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  //const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);

  const closeAddModal = useCallback(() => {
    setIsOpenAddModal(false);
    setSelectedItemId(null);
  }, []);

  const openAddModal = useCallback((itemId: number | null = null) => {
    //setIsOpenDetailsModal(false);
    setIsOpenAddModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsOpenEditModal(false);
    setSelectedItemId(null);
  }, []);

  const openEditModal = useCallback((itemId: number | null = null) => {
    setIsOpenDetailsModal(false);
    setIsOpenEditModal(true);
    setSelectedItemId(itemId);
  }, []);

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

  const deleteExamQuestionsBank = async (itemId: number) => {
    let response = await deleteQuestionsBank(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='question.label' />}}
        />,
      );

      refreshDataTable();
    }
  };

  const openImportModal = useCallback(() => {
    setIsOpenImportModal(true);
  }, []);

  const closeImportModal = useCallback(() => {
    setIsOpenImportModal(false);
  }, []);

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const questionTypeFilter = useMemo(
    () => [
      {
        id: QuestionType.MCQ,
        title: messages['question.type.mcq'],
      },
      {
        id: QuestionType.FILL_IN_THE_BLANK,
        title: messages['common.fill_in_the_blanks'],
      },
      {
        id: QuestionType.YES_NO,
        title: messages['question.type.y_n'],
      },
      {
        id: QuestionType.DESCRIPTIVE,
        title: messages['common.descriptive'],
      },
    ],
    [locale],
  );
  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.question'] as string,
        field: 'title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.question_en'] as string,
        field: 'title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.exam_subject_title'] as string,
        field: 'exam_subject_title',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
        filter: {
          apiPath: API_EXAM_SUBJECTS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'subject_id',
      },
      {
        headerName: messages['common.exam_subject_title_en'] as string,
        field: 'exam_subject_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['question.type'] as string,
        field: 'question_type',
        sortable: true,
        width: 250,
        filterable: true,
        filter: {
          options: questionTypeFilter,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row?.question_type;
          return <div>{questionType(data)}</div>;
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 100,
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {exam_question_bank_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {exam_question_bank_permissions.canUpdate && (
                <EditButton onClick={() => openEditModal(data.id)} />
              )}
              {exam_question_bank_permissions.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteExamQuestionsBank(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_EXAM_QUESTION_BANK,
  });

  const questionType = (data: any) => {
    switch (String(data)) {
      case QuestionType.MCQ:
        return messages['question.type.mcq'];
      case QuestionType.FILL_IN_THE_BLANK:
        return messages['common.fill_in_the_blanks'];
      case QuestionType.YES_NO:
        return messages['question.type.y_n'];
      case QuestionType.DESCRIPTIVE:
        return messages['common.descriptive'];
      default:
        return '';
    }
  };

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconQuestion /> <IntlMessages id='question-bank.label' />
          </>
        }
        extra={[
          other_permissions.exam_question_bank_import ? (
            <CommonButton
              key={2}
              onClick={() => openImportModal()}
              btnText={'common.import'}
              variant={'outlined'}
              color={'primary'}
              style={{marginLeft: '5px', marginRight: '10px'}}
              startIcon={<DownloadIcon />}
            />
          ) : (
            ''
          ),
          exam_question_bank_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['question-bank.label'],
                  }}
                />
              }
            />
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
          toggleResetTable={isToggleTable}
        />
        {isOpenEditModal && (
          <QuestionsBankEditPopup
            key={1}
            onClose={closeEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenAddModal && (
          <QuestionsBankAddPopup
            key={1}
            onClose={closeAddModal}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <QuestionsBankDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openEditModal}
          />
        )}

        {isOpenImportModal && (
          <ImportQuestionPopup
            key={1}
            onClose={closeImportModal}
            refreshDataTable={refreshDataTable}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default QuestionsBankPage;
