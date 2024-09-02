import React from 'react';
import {Box, Grid, IconButton} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconTrainer from '../../../@core/icons/IconTrainer';
import {useFetchYouthCertificate} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from "../../../@core/common/apiRoutes";
import {adminDomain} from "../../../@core/common/constants";
import {LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW} from "../../../@core/common/appLinks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {Body1, Link} from "../../../@core/elements/common";
import ImageView from "../../../@core/elements/display/ImageView/ImageView";

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const CertificateDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {data: itemData, isLoading} = useFetchYouthCertificate(itemId);
  const {messages} = useIntl();
  //const authUser = useAuthUser();


  let fileExtension: string | undefined;

  function getFileExtension(filePath: string): string {
    const parts: string[] = filePath.split('.');
    const extension: string = parts[parts.length - 1];
    return extension;
  }

  if (itemData?.certificate_file_path) {
    fileExtension = getFileExtension(itemData.certificate_file_path);
  }


  /*const {certificate_verification: certificate_verify_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);*/

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconTrainer/>
            <IntlMessages id='menu.certificate_verification'/>
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading}/>
            {/*{trainer_permission.canUpdate && itemData && (
              <EditButton
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}*/}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.name']}
              value={itemData?.name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.father_name']}
              value={itemData?.father_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.mother_name']}
              value={itemData?.mother_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_nid_birth_no']}
              value={itemData?.identity_number}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_course_name_bn']}
              value={itemData?.certification_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_course_name_en']}
              value={itemData?.certification_name_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_number']}
              value={itemData?.certificate_number}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_institute_department_bn']}
              value={itemData?.institute_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_institute_department_en']}
              value={itemData?.institute_name_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.training_center_bn']}
              value={itemData?.training_center_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.training_center_en']}
              value={itemData?.training_center_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_grade']}
              value={itemData?.result}
              isLoading={isLoading}
            />
          </Grid>
          {
            itemData?.certificate_file_path && fileExtension && fileExtension === 'pdf' ? (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.certificate']}
                  value={<PictureAsPdfIcon/>}
                  isLoading={isLoading}
                />
                <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Body1>{messages['common.certificate_full_view']}</Body1>
                  <Link
                    href={
                      itemData?.certificate_file_path
                        ? FILE_SERVER_FILE_VIEW_ENDPOINT +
                        itemData.certificate_file_path
                        : adminDomain() +
                        LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW +
                        itemData.certificate_issued_id
                    }
                    target={'_blank'}
                    style={{marginRight: '10px'}}>
                    <IconButton
                      color='primary'
                      aria-label='view certificate'
                      component='span'>
                      <VisibilityIcon/>
                    </IconButton>
                  </Link>
                </Box>
              </Grid>
            ) : itemData?.certificate_file_path && fileExtension && fileExtension !== 'pdf' && (
              <Grid item xs={12} sm={6} md={6}>
                <ImageView
                  label={messages['common.certificate']}
                  imageUrl={itemData?.certificate_file_path}
                  isLoading={isLoading}
                />
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Body1>{messages['common.certificate_full_view']}</Body1>
                  <Link
                    href={
                      itemData?.certificate_file_path
                        ? FILE_SERVER_FILE_VIEW_ENDPOINT +
                        itemData.certificate_file_path
                        : adminDomain() +
                        LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW +
                        itemData.certificate_issued_id
                    }
                    target={'_blank'}
                    style={{marginRight: '10px'}}>
                    <IconButton
                      color='primary'
                      aria-label='view certificate'
                      component='span'>
                      <VisibilityIcon/>
                    </IconButton>
                  </Link>
                </Box>
              </Grid>
            )
          }
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_batch_start_date']}
              value={itemData?.start_date}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_batch_end_date']}
              value={itemData?.end_date}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_location_bn']}
              value={itemData?.location}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.certificate_location_en']}
              value={itemData?.location_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.status']}
              value={itemData?.row_status == 1 ? messages['common.verified'] : itemData?.row_status == 2 ? messages['common.pending'] : itemData?.row_status == 3 ? messages['common.rejected'] : ''}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default CertificateDetailsPopup;
