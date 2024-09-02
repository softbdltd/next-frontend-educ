// import {formatDate} from '@formatjs/intl';
import {RELATION_TYPES} from '../../../../../@core/common/constants';
import {
  convertEnglishDigitsToBengali,
  getIntlDateFromString,
  getMomentDateFormat,
} from '../../../../../@core/utilities/helpers';
import {CERTIFICATE_LANGUAGE, CERTIFICATE_TYPE} from '../../Constants';

export const generateYouthInfoData = ({
  issueData,
  profileInfo,
  formatDate,
}: any) => {
  const isCertificateBangle =
    issueData.certificate_language == CERTIFICATE_LANGUAGE.BANGLA;
  let profileData: any = {
    certificate_template: issueData.certificate_template,
    'batch-name':
      issueData[isCertificateBangle ? 'batch_title' : 'batch_title_en'],
    'batch-start-date': isCertificateBangle
      ? getIntlDateFromString(formatDate, issueData.batch_start_date, 'short')
      : getMomentDateFormat(issueData.batch_start_date, 'DD MMMM, YYYY'),
    'batch-end-date': isCertificateBangle
      ? getIntlDateFromString(formatDate, issueData.batch_end_date, 'short')
      : getMomentDateFormat(issueData.batch_end_date, 'DD MMMM, YYYY'),
    'course-name':
      issueData[isCertificateBangle ? 'course_title' : 'course_title_en'],
    'training-center':
      issueData[
        isCertificateBangle
          ? 'training_center_title'
          : 'training_center_title_en'
      ],
  };
  let father_name = null;
  let mother_name = null;
  let identity = null;

  if (profileInfo && profileInfo?.learner_guardians?.length > 0) {
    const father = profileInfo.learner_guardians.find(
      (e: any) => e.relationship_type == RELATION_TYPES.FATHER,
    );
    const mother = profileInfo.learner_guardians.find(
      (e: any) => e.relationship_type == RELATION_TYPES.MOTHER,
    );
    if (mother) {
      mother_name = mother[isCertificateBangle ? 'name' : 'name_en'];
    }
    if (father) {
      father_name = father[isCertificateBangle ? 'name' : 'name_en'];
    }
  }
  if (profileInfo.identity_number) {
    identity = isCertificateBangle
      ? convertEnglishDigitsToBengali(profileInfo.identity_number)
      : profileInfo.identity_number;
  }

  profileData['father-name'] = father_name;
  profileData['mother-name'] = mother_name;
  profileData['candidate-nid'] =
    profileInfo.identity_number_type === 1 ? identity : null;
  profileData['candidate-name'] = `${
    profileInfo[isCertificateBangle ? 'first_name' : 'first_name_en']
  } ${profileInfo[isCertificateBangle ? 'last_name' : 'last_name_en']}`;
  profileData['mother-name'] = mother_name;
  profileData['candidate-birth-cid'] =
    profileInfo.identity_number_type === 2 ? identity : null;

  let grade = null;
  let marks = null;
  let result = issueData?.learner_result;
  if (result) {
    grade = result?.result;
    marks =
      issueData?.certificate_type == CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT
        ? result?.result == 'Pass'
          ? 'Competent'
          : 'Not Competent'
        : result?.result;
  }
  profileData['grade'] = grade;
  profileData['marks'] = marks;
  return profileData;
};

export const generateOrganizationInfoData = ({
  issueData,
  profileInfo,
  formatDate,
  formatNumber,
}: any) => {
  const isCertificateBangle =
    issueData.certificate_language == CERTIFICATE_LANGUAGE.BANGLA;
  let profileData = {
    certificate_template: issueData.certificate_template,
    title: profileInfo[isCertificateBangle ? 'title' : 'title_en'],
    address: profileInfo[isCertificateBangle ? 'address' : 'address_en'],
    contact_person_name:
      profileInfo[
        isCertificateBangle ? 'contact_person_name' : 'contact_person_name_en'
      ],
    tin_no: profileInfo.tin_number
      ? formatNumber(profileInfo.tin_number, {useGrouping: false})
      : '',
    membership_id_number: profileInfo.membership_id
      ? formatNumber(profileInfo.membership_id, {useGrouping: false})
      : '',
    previous_membership_no: profileInfo.previous_membership_no
      ? formatNumber(profileInfo.previous_membership_no, {useGrouping: false})
      : '',
    first_issue_date: isCertificateBangle
      ? getIntlDateFromString(formatDate, profileInfo.first_issue_date, 'short')
      : getMomentDateFormat(profileInfo.first_issue_date, 'DD MMMM, YYYY'),
    expire_date: isCertificateBangle
      ? getIntlDateFromString(
          formatDate,
          profileInfo.membership_expire_date,
          'short',
        )
      : getMomentDateFormat(
          profileInfo.membership_expire_date,
          'DD MMMM, YYYY',
        ),
    last_update_date: isCertificateBangle
      ? getIntlDateFromString(formatDate, profileInfo.last_update_date, 'short')
      : getMomentDateFormat(profileInfo.last_update_date, 'DD MMMM, YYYY'),
  };

  return profileData;
};
