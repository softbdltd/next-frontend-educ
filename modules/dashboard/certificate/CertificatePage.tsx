import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {API_CERTIFICATE_TEMPLATES} from '../../../@core/common/apiRoutes';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';

import {
  getMomentDateFormat,
  isResponseSuccess,
} from '../../../@core/utilities/helpers';
import {deleteCertificate} from '../../../services/CertificateAuthorityManagement/CertificateService';
import {CERTIFICATE_TYPE} from './Constants';
import {Link} from '../../../@core/elements/common';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import CertificatePreviewPopup from './CertificatePreviewPopUp';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

const CertificateTemplatePage = () => {
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const router = useRouter();
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const {certificate_template: certificate_templatePermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_CERTIFICATE_TEMPLATES,
    paramsValueModifier: (params) => {
      params['with_batches'] = 1;
      return params;
    },
  });

  const certificateTypesFilter = useMemo(
    () => [
      {
        id: CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT,
        title: messages['certificate.competent_or_not'],
      },
      {
        id: CERTIFICATE_TYPE.GRADING,
        title: messages['certificate.grading'],
      },
      {
        id: CERTIFICATE_TYPE.MARKS,
        title: messages['certificate.marks'],
      },
      {
        id: CERTIFICATE_TYPE.PARTICIPATION,
        title: messages['certificate.participation'],
      },
    ],
    [messages],
  );

  const openCertificateAddUpdateView = useCallback((certificateId?: any) => {
    const path = '/certificate/editor';
    const params = certificateId
      ? {pathname: path, certificateId}
      : {pathname: path};
    router.push(params).then(() => {});
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

  const deleteCertificateTemplate = async (certificateId: number) => {
    try {
      let response = await deleteCertificate(certificateId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='certificate.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const getCertificateTypeName = (certificate_type: any) => {
    switch (Number(certificate_type)) {
      case CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT:
        return messages['certificate.competent_or_not'];
      case CERTIFICATE_TYPE.GRADING:
        return messages['certificate.grading'];
      case CERTIFICATE_TYPE.MARKS:
        return messages['certificate.marks'];
      case CERTIFICATE_TYPE.PARTICIPATION:
        return messages['certificate.participation'];
      default:
        return '';
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['certificate.certificate_title'] as string,
        width: 300,
        field: 'title',
        filterable: true,
      },
      {
        headerName: messages['certificate.certificate_type'] as string,
        width: 150,
        field: 'certificate_type',
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{getCertificateTypeName(data.certificate_type)}</span>;
        },
        filterable: true,
        filter: {
          options: certificateTypesFilter,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
      },
      {
        headerName: messages['common.issue_date'] as string,
        width: 130,
        field: 'issued_at',
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <span>
              {data?.issued_at
                ? getMomentDateFormat(data?.issued_at, 'DD MMMM, YYYY')
                : null}
            </span>
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 550,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {certificate_templatePermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {!data.issued_at && certificate_templatePermission.canUpdate && (
                <Link
                  href={`/certificate/editor?certificateId=${data.id}`}
                  passHref={true}>
                  <CommonButton
                    btnText='common.edit_btn'
                    startIcon={<EditIcon style={{marginLeft: '5px'}} />}
                    style={{marginLeft: '10px'}}
                    variant='outlined'
                    color='primary'
                  />
                </Link>
              )}
              <Link
                href={`/certificate/editor?certificateId=${data.id}&new=true`}
                passHref={true}>
                <CommonButton
                  btnText='common.duplicate'
                  startIcon={<ContentCopyIcon style={{marginLeft: '5px'}} />}
                  style={{marginLeft: '10px'}}
                  variant='outlined'
                  color='primary'
                />
              </Link>{' '}
              {!data?.batches?.length &&
                certificate_templatePermission.canDelete && (
                  <ConfirmationButton
                    buttonType={'delete'}
                    confirmAction={() => deleteCertificateTemplate(data.id)}
                  />
                )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, certificateTypesFilter],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <BookmarkAddedIcon />{' '}
            <IntlMessages id='certificate_template.name' />
          </>
        }
        extra={[
          certificate_templatePermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openCertificateAddUpdateView()}
              isLoading={false}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['certificate_template.name'],
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
          showColumnToolbar={true}
        />
      </PageContentBlock>
      {isOpenDetailsModal && selectedItemId && (
        <CertificatePreviewPopup
          key={1}
          itemId={selectedItemId}
          onClose={closeDetailsModal}
        />
      )}
    </>
  );
};

export default CertificateTemplatePage;
