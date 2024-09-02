import React, {FC, useEffect, useState} from 'react';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FrontendCustomModal from '../../../@core/modals/FrontendCustomModal/FrontendCustomModal';
import {useIntl} from 'react-intl';
import LanguageCodes from '../../../@core/utilities/LocaleLanguage';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuButton from '../../../@core/elements/button/MenuButton';
import _ from 'lodash';
import {learnerDomain} from '../../../@core/common/constants';
import {LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW} from '../../../@core/common/appLinks';
import {CERTIFICATE_TYPE} from '../../dashboard/certificate/Constants';

interface CertificatePopupProps {
  onClose: () => void;
  certificateLists: any;
}

const CertificatePopup: FC<CertificatePopupProps> = ({
  onClose,
  certificateLists,
}) => {
  const {messages, locale, formatNumber} = useIntl();
  const [certificateBatchLists, setCertificateBatchLists] = useState<any>([]);

  const getMessage = (certificateType: any) => {
    switch (Number(certificateType)) {
      case CERTIFICATE_TYPE.PARTICIPATION:
        return messages['common.participate_certificate'];
      case CERTIFICATE_TYPE.GRADING:
        return messages['common.grading_certificate'];
      case CERTIFICATE_TYPE.MARKS:
        return messages['common.marking_certificate'];
      case CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT:
        return messages['common.competent_certificate'];
      default:
        return '';
    }
  };

  useEffect(() => {
    if (certificateLists?.length > 0) {
      let batches: Array<any> = [];
      let batchList = _.mapValues(_.groupBy(certificateLists, 'batch_id'));
      Object.keys(batchList).map((batchId: string) => {
        let obj: any = {};
        let batch: any = batchList[batchId][0];
        obj.batchId = batchId;
        obj.title = batch.batch_title;
        obj.title_en = batch.batch_title_en;

        let items: any = [];
        batchList[batchId].map((cert: any) => {
          let item: any = {};
          item.href =
            learnerDomain() + LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW + cert.id;
          item.target = '_blank';
          item.label = getMessage(cert.certificate_type);
          items.push(item);
        });
        obj.certificates = items;
        batches.push(obj);
      });
      setCertificateBatchLists(batches);
    }
  }, [certificateLists]);

  return (
    <FrontendCustomModal
      onClose={onClose}
      open={true}
      title={
        <>
          <IntlMessages id='common.certificate_info' />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'lg'}
      actions={
        <Button
          startIcon={<CancelIcon />}
          variant='outlined'
          onClick={onClose}
          color={'warning'}>
          {'Cancel'}
        </Button>
      }>
      <TableContainer component={Paper}>
        <Table size={'small'} aria-label='Language proficiency table'>
          <TableHead>
            <TableRow>
              <TableCell>{messages['common.certificate_id']}</TableCell>
              <TableCell>{messages['common.batch_name']}</TableCell>
              <TableCell>{messages['common.certificate_view']}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {certificateBatchLists.map((batch: any, index: any) => (
              <TableRow key={index}>
                <TableCell component='th' scope='language'>
                  {formatNumber(index + 1)}
                </TableCell>

                <TableCell component='th' scope='language'>
                  {locale == LanguageCodes.BN ? batch?.title : batch?.title_en}
                </TableCell>

                <TableCell component='th' scope='language'>
                  <MenuButton
                    items={batch.certificates}
                    buttonText={messages['common.certificate_view'] as string}
                    containerStyle={{display: 'inline-block'}}
                    buttonProps={{
                      sx: {
                        marginLeft: '20px',
                        borderRadius: '25px',
                        height: '32px',
                      },
                      size: 'small',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FrontendCustomModal>
  );
};

export default CertificatePopup;
