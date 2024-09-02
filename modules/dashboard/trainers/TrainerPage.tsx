import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteTrainer} from '../../../services/instituteManagement/TrainerService';
import TrainerAddEditPopup from './TrainerAddEditPopup';
import TrainerDetailsPopup from './TrainerDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconTrainer from '../../../@core/icons/IconTrainer';
import {API_SKILLS, API_TRAINERS} from '../../../@core/common/apiRoutes';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import Tooltip from '@mui/material/Tooltip';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';
import TextFilterField from '../../../@core/components/DataTable/TextFilterField';

const TrainersPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [additionalFilters, setAdditionalFilters] = useState<any>({});

  const {trainer: trainer_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setTrainerId(null);
  }, []);

  const openAddEditModal = useCallback((trainerId: number | null = null) => {
    setIsOpenDetailsModal(false);
    setIsOpenAddEditModal(true);
    setTrainerId(trainerId);
  }, []);

  const openDetailsModal = useCallback(
    (trainerId: number) => {
      setIsOpenDetailsModal(true);
      setTrainerId(trainerId);
    },
    [trainerId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const deleteTrainerItem = async (itemId: number) => {
    try {
      let response = await deleteTrainer(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='trainers.label' />}}
          />,
        );
        await refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };
  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.full_name'] as string,
        field: 'trainer_first_name',
        width: 250,
        hide: locale == LocaleLanguage.EN,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;

          return data.trainer_first_name + ' ' + data.trainer_last_name;
        },
      },
      {
        headerName: messages['common.full_name_en'] as string,
        field: 'trainer_first_name_en',
        width: 250,
        hide: locale == LocaleLanguage.BN,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;

          return data.trainer_first_name_en + ' ' + data.trainer_last_name_en;
        },
      },
      {
        headerName: messages['common.email'] as string,
        width: 200,
        field: 'email',
        hide: false,
      },

      {
        headerName: messages['common.subject'] as string,
        width: 200,
        field: 'subject',
        hide: false,
        filterable: true,
      },
      {
        headerName: messages['common.skills'] as string,
        field: 'skills',
        filterable: true,
        width: 350,
        filterKey: 'skill_ids',
        filter: {
          apiPath: API_SKILLS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: true,
        },
        renderCell: (props: any) => {
          const {skills} = props?.row;
          const skill_jsx = (skills || [])?.map((skill: any) =>
            locale === localeLanguage.BN
              ? skill?.title ?? skill?.title_en
              : skill?.title_en ?? skill?.title,
          );
          return (
            <Tooltip title={skill_jsx.join(', ')} placement='top-start'>
              <p>
                {skill_jsx.length <= 3
                  ? skill_jsx.join(', ')
                  : skill_jsx.slice(0, 3).join(', ')}
              </p>
            </Tooltip>
          );
        },
      },
      {
        headerName: messages['common.mobile'] as string,
        field: 'mobile',
        width: 150,
        hideable: false,
      },

      {
        headerName: messages['common.trainer_center'] as string,
        field: 'training_center_title',
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;

          return locale === localeLanguage.BN
            ? data?.training_center_title
            : data?.training_center_title_en;
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 350,
        hideable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {trainer_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {trainer_permission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {trainer_permission.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteTrainerItem(data.id)}
                />
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
    urlPath: API_TRAINERS,
  });
  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconTrainer /> <IntlMessages id='trainers.label' />
          </>
        }
        extra={[
          trainer_permission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['trainers.label'],
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
          additionalFilterFieldsPosition={'start'}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <TextFilterField
                  id={'search_text'}
                  label={messages['common.search_text']}
                  value={routeValue['search_text'] ?? ''}
                  onChange={(key: string, value: string) => {
                    let filters = {
                      ...additionalFilters,
                      [key]: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
              </>
            );
          }}
        />
        {isOpenAddEditModal && (
          <TrainerAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={trainerId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && trainerId && (
          <TrainerDetailsPopup
            key={1}
            itemId={trainerId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default TrainersPage;
