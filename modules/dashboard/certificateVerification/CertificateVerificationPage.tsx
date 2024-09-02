import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import {learnerCertificateVerifyOrReject} from '../../../services/instituteManagement/TrainerService';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconTrainer from '../../../@core/icons/IconTrainer';
import {API_CERTIFICATES} from '../../../@core/common/apiRoutes';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import CertificateDetailsPopup from "./CertificateDetailsPopup";
import {Body1} from "../../../@core/elements/common";

const CertificateVerificationPage = () => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [learnerId, setYouthId] = useState<number | null>(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  //const [additionalFilters, setAdditionalFilters] = useState<any>({});

  const {certificate_verification: certificate_verify_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const openAddEditModal = useCallback((learnerId: number | null = null) => {
    setIsOpenDetailsModal(false);
    setYouthId(learnerId);
  }, []);

  const openDetailsModal = useCallback(
    (learnerId: number) => {
      setIsOpenDetailsModal(true);
      setYouthId(learnerId);
    },
    [learnerId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const verifyOrRejectYouthCertificate = async (itemId: number, rowStatus: number) => {
    try {
      let response = await learnerCertificateVerifyOrReject(itemId, rowStatus);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id={rowStatus === 1 ? 'common.certificate_verified_successfully' : 'common.certificate_rejected_successfully'}
            values={{subject: <IntlMessages id='common.certificate'/>}}
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
        headerName: messages['common.name'] as string,
        field: 'name',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.name;
        },
      },
      {
        headerName: messages['common.father_name'] as string,
        field: 'father_name',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.father_name;
        },
      },
      {
        headerName: messages['common.mother_name'] as string,
        field: 'mother_name',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;

          return data.mother_name;
        },
      },
      {
        headerName: messages['common.certificate_course_name'] as string,
        field: 'certification_name',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;

          return data.certification_name;
        },
      },
      {
        headerName: messages['common.certificate_number'] as string,
        field: 'certificate_number',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.certificate_number;
        },
      },
      {
        headerName: messages['common.identity_number'] as string,
        field: 'identity_number',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.identity_number;
        },
      },
      {
        headerName: messages['common.certificate_institute_department'] as string,
        field: 'institute_name',
        width: 250,
        //hide: locale == LocaleLanguage.BN,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.institute_name;
        },
      },
      {
        headerName: messages['common.certificate_training_center'] as string,
        field: 'training_center_title_en',
        width: 250,
        //hide: locale == LocaleLanguage.BN,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.training_center_title_en;
        },
      },
      {
        headerName: messages['education.result'] as string,
        field: 'result',
        width: 250,
        filterKey: 'name',
        renderCell: (props: any) => {
          let data = props.row;
          return data.result;
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <Body1>{data?.row_status == 1 ? messages['common.verified'] : data?.row_status == 2 ? messages['common.pending'] : data?.row_status == 3 ? messages['common.rejected'] : ''}</Body1>
          );
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
              {certificate_verify_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)}/>
              )}
              {/*{certificate_verify_permission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)}/>
              )}*/}
              {certificate_verify_permission.canApprove && data?.row_status === 2 && (
                <ConfirmationButton
                  buttonType='approve'
                  labelMessageKey={'common.approve'}
                  confirmAction={() => verifyOrRejectYouthCertificate(data.id, 1)}
                />
              )
                /* <CommonButton
                 btnText={'common.verified'}
                 disabled={true}
                 variant={'text'}
                 color='primary'
                 />*/

              }

              {certificate_verify_permission.canApprove && data?.row_status === 2 && (
                <ConfirmationButton
                  buttonType='reject'
                  labelMessageKey={'common.reject'}
                  confirmAction={() => verifyOrRejectYouthCertificate(data.id, 3)}
                />
              )

                /* <CommonButton
                 btnText={'common.rejected'}
                 disabled={true}
                 variant={'text'}
                 color='primary'
                 />*/
              }
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_CERTIFICATES,
  });
  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconTrainer/> <IntlMessages id='menu.certificate_verification'/>
          </>
        }
      >
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          additionalFilterFieldsPosition={'start'}
          /*additionalFilterFields={(routeValue, onChange) => {
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
          }}*/
        />

        {isOpenDetailsModal && learnerId && (
          <CertificateDetailsPopup
            key={1}
            itemId={learnerId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default CertificateVerificationPage;
