import React, {useCallback, useState} from 'react';
import {Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Router, {useRouter} from 'next/router';
import {StageRefContainer} from '../../state/containers/StageRefContainer';
import {jsPDF} from 'jspdf';
import {useAuthUser} from '../../../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../../../redux/types/models/CommonAuthUser';
import {addCertificateToUserProfile} from '../../../../../../services/CertificateAuthorityManagement/CertificateService';
import {processServerSideErrors} from '../../../../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../../../../@core/hooks/useNotifyStack';
import IntlMessages from '../../../../../../@core/utility/IntlMessages';
import {useFetchPrivateOrPublicCertificateIssue} from '../../../../../../services/instituteManagement/hooks';

type Props = {
  templateId?: string | number;
  is4IRCertificate?: boolean;
};

function ViewHeader({templateId, is4IRCertificate = false}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const {getStageAreaRef} = StageRefContainer.useContainer();
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();
  const {query} = useRouter();
  const {data: issueData} = useFetchPrivateOrPublicCertificateIssue(
    is4IRCertificate ? null : query?.certificateIssueId,
    authUser,
  );

  const handleClick = useCallback(() => {
    setLoading(true);
    const template = getStageAreaRef();
    if (template) {
      const uri = template.toDataURL({pixelRatio: 4});
      const orientation =
        template.attrs.width > template.attrs.height ? 'l' : 'p';
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [template.attrs.width, template.attrs.height],
        compress: true,
      });
      //@ts-ignore
      doc.addImage(
        uri,
        'PNG',
        0,
        0,
        Number(template.attrs.width),
        Number(template.attrs.height),
        '',
        'FAST',
      );
      doc.save('certificate.pdf');

      setLoading(false);
      /*setTimeout(() => {
        setLoading(false);
      }, 2000);*/
    }
  }, [getStageAreaRef]);

  const handleAddCertificateToYouthProfile = useCallback(async () => {
    if (query.certificateIssueId) {
      try {
        await addCertificateToUserProfile({
          certificate_issued_id: query.certificateIssueId,
        });
        successStack(
          <IntlMessages id='common.certificate_added_successfully' />,
        );
      } catch (error: any) {
        processServerSideErrors({
          error,
          errorStack,
        });
      }
    }
  }, [query]);

  return (
    <div
      className={`editor-header${
        authUser?.isYouthUser ? ' learner-editor-header' : ''
      }`}
      style={{display: templateId ? 'none' : 'flex'}}>
      <div className='editor-header-inner'>
        <div
          className='editor-header-inner-left'
          style={{justifyContent: 'flex-start'}}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={() => Router.back()}>
            Go Back
          </Button>
        </div>
        <div className='editor-header-inner-right'>
          {authUser?.isYouthUser &&
            issueData?.is_certificate_already_added === false && (
              <Button
                variant='outlined'
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddCertificateToYouthProfile}
                disabled={loading}
                sx={{color: 'black'}}>
                Add Certificate
              </Button>
            )}
          <Button
            variant='outlined'
            sx={
              loading
                ? {
                    color: '#968989 !important',
                    borderColor: '#968989 !important',
                  }
                : {}
            }
            startIcon={<SaveIcon />}
            onClick={() => {
              handleClick();
            }}
            disabled={loading}>
            {!loading ? 'Download' : 'Downloading'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewHeader;
