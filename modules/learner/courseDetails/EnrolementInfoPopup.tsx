import React, {FC} from 'react';
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
import ConfirmationStatus from '../../../@core/components/JobScheduleResponsePopup/ConfirmationStatus';
import FrontendCustomModal from '../../../@core/modals/FrontendCustomModal/FrontendCustomModal';
import {useIntl} from 'react-intl';
import LanguageCodes from '../../../@core/utilities/LocaleLanguage';
import {Link} from '../../../@core/elements/common';
import {learnerDomain} from '../../../@core/common/constants';
import {LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT} from '../../../@core/common/appLinks';
import {CoursePaymentTypes, PaymentStatus} from './CourseDetailsEnums';

interface EnrolementInfoPopupProps {
  onClose: () => void;
  enrollments: any;
  courseId: any;
  isEnrollable?: boolean;
  lastEnrollInfo?: any;

  isCoursePaymentEnabled?: boolean;
}

const EnrolementInfoPopup: FC<EnrolementInfoPopupProps> = ({
  onClose,
  enrollments,
  lastEnrollInfo,
  courseId,
  isEnrollable,
  isCoursePaymentEnabled,
}) => {
  const {messages, locale, formatNumber} = useIntl();

  const placeholder = (text: any, msg: any) => {
    if (text === null) return messages[msg];
    return text;
  };

  const getPaymentStatusContent = (enrollement: any) => {
    if (
      enrollement?.payment_status == PaymentStatus.UN_PAID ||
      enrollement?.payment_status == PaymentStatus.PARTIAL
    ) {
      if (
        enrollement?.course_payment_type ==
        CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN
      ) {
        return messages['course.pay_after_batch_assign'];
      }
      return messages['common.unpaid'];
    } else {
      return messages['common.paid'];
    }
  };

  const getActionButton = () => {
    if (
      !isCoursePaymentEnabled ||
      lastEnrollInfo?.row_status == ConfirmationStatus.REJECTED
    ) {
      return (
        <Button variant={'contained'} color={'primary'}>
          {messages['common.enroll_now']}
        </Button>
      );
    } else {
      if (
        lastEnrollInfo?.course_payment_type ==
          CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN &&
        lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID
      ) {
        return <>UN_PAID</>;
      } else if (
        lastEnrollInfo?.course_payment_type ==
          CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN &&
        lastEnrollInfo?.payment_status == PaymentStatus.PARTIAL
      ) {
        return <>PARTIAL</>;
      } else {
        return (
          <Button variant={'contained'} color={'primary'}>
            {messages['common.enroll_now']}
          </Button>
        );
      }
    }
  };

  return (
    <FrontendCustomModal
      onClose={onClose}
      open={true}
      title={
        <>
          <IntlMessages id='common.enrollement_info' />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'lg'}
      actions={
        isEnrollable && (
          <Link
            href={
              learnerDomain() + LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT + courseId
            }>
            {getActionButton()}
          </Link>
        )
      }>
      <TableContainer component={Paper}>
        <Table size={'small'} aria-label='Language proficiency table'>
          <TableHead>
            <TableRow>
              <TableCell>{messages['common.enrollement_id']}</TableCell>
              <TableCell>{messages['common.verification_status']}</TableCell>
              <TableCell>{messages['common.payment_status']}</TableCell>
              <TableCell>{messages['common.training_center']}</TableCell>
              <TableCell>{messages['common.batch_name']}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(enrollments || []).map((enrollement: any, index: any) => (
              <TableRow key={index}>
                <TableCell component='th' scope='language'>
                  {formatNumber(index + 1)}
                </TableCell>
                <TableCell component='th' scope='language'>
                  {enrollement?.verification_code_verified_at
                    ? messages['common.verified']
                    : messages['common.not_verified']}
                </TableCell>
                <TableCell component='th' scope='language'>
                  {getPaymentStatusContent(enrollement)}
                </TableCell>
                <TableCell component='th' scope='language'>
                  {locale == LanguageCodes.BN
                    ? placeholder(
                        enrollement?.training_center_title,
                        'common.training_center_not_assigned',
                      )
                    : placeholder(
                        enrollement?.training_center_title_en,
                        'common.training_center_not_assigned',
                      )}
                </TableCell>
                <TableCell component='th' scope='language'>
                  {locale == LanguageCodes.BN
                    ? placeholder(
                        enrollement?.batch_title,
                        'common.batch_not_assigned',
                      )
                    : placeholder(
                        enrollement?.batch_title_en,
                        'common.batch_not_assigned',
                      )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FrontendCustomModal>
  );
};

export default EnrolementInfoPopup;
