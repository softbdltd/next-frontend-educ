import {startCase as lodashStartCase} from 'lodash';
import moment from 'moment';
import {CommonAuthUser} from '../../redux/types/models/CommonAuthUser';
import ShowInTypes from './ShowInTypes';
import {getBrowserCookie} from '../libs/cookieInstance';
import {COOKIE_KEY_INSTITUTE_ID} from '../../shared/constants/AppConst';
import {getHostUrl} from '../common/SSOConfig';
import {industryDomain, instituteDomain, isLocalHost, educDomain, learnerDomain,} from '../common/constants';
import URL from 'url';
import UserTypes from './UserTypes';
import userTypes from './UserTypes';
import {MAX_PAGE_SIZE, MIN_PAGE_SIZE} from './PageSizes';
import LocaleLanguage from './LocaleLanguage';
import {FormatDateOptions} from '@formatjs/intl/src/types';
import {scaleLinear} from 'd3-scale';
import IdentityNumberTypes from './IdentityNumberTypes';
import PartnerCategories, {NewPartnerCategories,} from '../../modules/dashboard/educPartners/PartnerCategories';

export const CHART_RADIAN = Math.PI / 180;
export const genders = [
  {
    key: 1,
    label: 'Male',
  },
  {
    key: 2,
    label: 'Female',
  },
  {
    key: 3,
    label: 'Others',
  },
];

export const marital_status = [
  {
    key: 0,
    label: 'No',
  },
  {
    key: 1,
    label: 'Yes',
  },
];

export const religions = [
  {
    id: 1,
    label: 'Islam',
  },
  {
    id: 2,
    label: 'Hindu',
  },
  {
    id: 3,
    label: 'Buddhist',
  },
  {
    id: 4,
    label: 'Christian',
  },
  {
    id: 5,
    label: 'Others',
  },
];

export const question_type = [
  {
    id: 1,
    label: 'common.mcq',
  },
  {
    id: 2,
    label: 'common.fill_in_the_blank',
  },
  {
    id: 3,
    label: 'common.yes_no',
  },
  {
    id: 4,
    label: 'common.descriptive',
  },
  {
    id: 5,
    label: 'common.field_work',
  },
  {
    id: 6,
    label: 'common.presentation',
  },
  {
    id: 7,
    label: 'common.practical',
  },
];

export const catchBlockHandler = (error: any, message = '') => {
  throw error;
};

export const getGenderText = (genderCode: string): string => {
  switch (genderCode) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
    default:
      return 'Prefer not to say';
  }
};

export const getDateFormat = (dateValue: any): string => {
  const date = new Date(dateValue);
  return date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();
};

export const getMomentDateFormat = (
  dateValue: any,
  format = 'MM-DD-YYYY',
): string => {
  const myDate = new Date(dateValue);
  if (moment(myDate).isValid()) {
    return moment(myDate).format(format);
  } else {
    return '';
  }
};

export const getMomentDateFormatForDatePicker = (
  dateValue: any,
  format = 'MM-DD-YYYY',
): string => {
  const myDate = new Date(dateValue);
  return moment(myDate)?.format(format);
};

export const addMonths = (date: Date, months: number) => {
  let d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
};

export const getMomentMonths = (): Array<string> => {
  return moment.months();
};

export const enterPressFocus = (ev: any, refField: any): void => {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    refField.current.focus();
  }
};

export const fileInputLabelChange = (ref: any, label: string) => {
  ref.current.offsetParent.children[1].innerText = label;
};

export const enterPressSubmit = (ev: any, callback: any): void => {
  if (ev.key === 'Enter') {
    callback();
  }
};

export const checkValidImageFormat = (file: any) => {
  return (
    file == undefined ||
    file.name.match(/\.(jpg|jpeg|png|svg|JPG|JPEG|PNG|SVG)$/) ||
    'Invalid file format ! Please upload .Jpg, .Png, or .Svg format file'
  );
};

export const checkValidImageFormatAndSize = async (file: any) => {
  if (file == undefined) {
    return;
  }
  if (!file.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|)$/)) {
    return 'Invalid file format ! Please upload .Jpg, .Png format file';
  }

  let _URL = window.URL || window.webkitURL;
  //let img = new Image();
  let imageUrl = _URL.createObjectURL(file);
  try {
    let image: any = await addImageProcess(imageUrl);
    return (
      (image.height == 750 && image.width == 750) ||
      'Image should be 750px X 750px'
    );
  } catch (e) {
  }
};

function addImageProcess(src: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export const getAge = (birthDateString: string): number => {
  let today = new Date();
  let birthDate = new Date(birthDateString);
  let age: number = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const range = (total: number, startFrom: number = 0): Array<number> => {
  let items: number[] = [];
  for (let i = startFrom; i <= total; i++) {
    items.push(i);
  }
  return items;
};

export const isDefined = (object: any, property: any): boolean => {
  return typeof object[property] !== 'undefined';
};

export const generatePageNumber = (
  pageIndex: number,
  totalPage: number,
  totalSlide: number = 5,
): Array<number> => {
  let startFrom =
    pageIndex === 1
      ? pageIndex
      : pageIndex === 2
        ? pageIndex - 1
        : pageIndex - 2;
  return totalPage === 0
    ? []
    : range(Math.min(totalSlide + startFrom, totalPage), startFrom);
};

export const countPaginatePage = (
  totalData: number,
  pageSize: number,
): number => {
  return totalData < 1 ? 0 : Math.ceil(totalData / pageSize);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const isResponseSuccess = (response: any) => {
  return response && response._response_status.success;
};

export const isValidationError = (response: any) => {
  return (
    response &&
    !response._response_status.success &&
    response._response_status.code == 400
  );
};

export const getObjectArrayFromValueArray = (valueArray: any) => {
  if (valueArray && Array.isArray(valueArray) && valueArray.length > 0) {
    return valueArray.map((item: any) => {
      return {value: item};
    });
  } else {
    return [{value: ''}];
  }
};

export const getValuesFromObjectArray = (objectArray: any) => {
  if (objectArray && Array.isArray(objectArray)) {
    return objectArray
      .map((item: any) => item.value)
      .filter((value: any) => value != '');
  } else {
    return [];
  }
};

export function camelToWords(str: string) {
  return lodashStartCase(str);
}

// function toSnakeCase(str: string) {
//   return snakeCase(str);
// }

function snakeToCamel(str: string) {
  const parts = str.split('_');
  return parts.reduce(function (p, c) {
    return p + c.charAt(0).toUpperCase() + c.slice(1);
  }, parts.shift()!);
}

export function toCamelCase(object: any, exceptions: string[] = []) {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  return Object.keys(object).reduce((p: { [key: string]: any }, key: string) => {
    const newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key;
    p[newKey] = toCamelCase(object[key]);
    return p;
  }, {});
}

export const getUserType = (user: CommonAuthUser | null) => {
  if (user?.isSystemUser) return UserTypes.SYSTEM_USER;
  else if (user?.isOrganizationUser) return UserTypes.ORGANIZATION_USER;
  else if (user?.isInstituteUser) return UserTypes.INSTITUTE_USER;
  else if (user?.isIndustryAssociationUser)
    return UserTypes.INDUSTRY_ASSOCIATION_USER;
    // else if (user?.isRegisteredTrainingOrganizationUser)
    //   return userTypes.REGISTERED_TRAINING_ORGANIZATION_USER;
  // else if (user?.isFourIrlUser) return userTypes.FOUR_IR_USER;
  else if (user?.isMinistryUser) return userTypes.MINISTRY_USER;
  else return UserTypes.SYSTEM_USER;
};

export const isNeedToSelectOrganization = (
  user: CommonAuthUser | null,
): boolean => {
  // if user is organization user no need to select organization
  if (user?.isOrganizationUser) {
    return false;
  }
  return true;
};

export const courseDuration = (
  messages: any,
  formatFn: any,
  duration: number,
) => {
  let dh = 0;
  let dm = 0;

  if (duration / 60 < 1) {
    return (
      formatFn(duration || 0) + ' ' + (messages['common.short_min'] as string)
    );
  } else {
    dm = duration % 60;
    dh = Math.floor(duration / 60);
    return (
      formatFn(dh || 0) +
      ' ' +
      (messages['common.short_hour'] as string) +
      ', ' +
      formatFn(dm || 0) +
      ' ' +
      (messages['common.short_min'] as string)
    );
  }
};

export const getCourseDuration = function (
  duration: number,
  formatFN: any,
  messages: any,
) {
  duration = formatFN(duration);

  if (duration > 1) {
    return duration + ' ' + (messages['common.hours'] as string);
  }

  return duration + ' ' + (messages['common.hour'] as string);
};

export const objectFilter = (object: any) => {
  Object.keys(object).forEach((key) => {
    if (!object[key]) {
      delete object[key];
    }
  });

  return object;
};

export const passingYears = () => {
  let passingYearsArray = [];
  const year = Number(new Date().getFullYear()) || 2022;
  for (let i = year; i > 1971; i--) {
    passingYearsArray.push({year: String(i)});
  }
  return passingYearsArray;
};

export const getYearsRange = (yearFrom: number) => {
  let passingYearsArray = [];
  const year = Number(new Date().getFullYear()) || 2022;
  for (let i = year; i > yearFrom; i--) {
    passingYearsArray.push({year: String(i)});
  }
  return passingYearsArray;
};

export const getYearsList = (count: number) => {
  let passingYearsArray = [];
  const year = Number(new Date().getFullYear()) || 2021;
  const range = year - (count + 1);
  for (let i = year; i > range; i--) {
    passingYearsArray.push({year: String(i)});
  }
  return passingYearsArray;
};

/*export const getModulePath = (path: string) => {
    const pathArray = path.split('/');
    if (pathArray.indexOf('learner') > -1) {
        return '/learner';
    } else if (pathArray.indexOf('institute') > -1) {
        return '/institute';
    } else {
        return '';
    }
};*/

export const getIntlTimeFromString = (formatFn: any, dateStr: any) => {
  const date = new Date(dateStr).toLocaleString();
  let time = formatFn(date);
  if (time !== 'Invalid Date') {
    return time;
  } else {
    return '';
  }
};

export const getIntlDateFromString = (
  formatFn: any,
  dateStr: any,
  monthFormat?: string,
) => {
  if (!dateStr) return null;
  const dt = new Date(dateStr).toLocaleString();
  if (dt !== 'Invalid Date') {
    return formatFn(dateStr, {
      day: '2-digit',
      month: monthFormat ? monthFormat : 'long',
      year: 'numeric',
    });
  } else {
    return dateStr;
  }
};

export const getIntlNumber = (formatFn: any, value: any) => {
  return value
    ? formatFn(value, {
      useGrouping: false,
    })
    : '';
};

export const getLanguageLabel = (language_configs: any, key: string) => {
  let label: string = '';
  (language_configs || []).map((lang: any) => {
    if (lang.code === key) {
      label = lang.native_name;
    }
  });
  return label;
};

/*export const getShowInTypeFromPath = (path: string) => {
    const pathArray = path.split('/');
    if (pathArray.indexOf('learner') > -1) {
        return ShowInTypes.LEARNER;
    } else if (pathArray.indexOf('institute') > -1) {
        return ShowInTypes.TSP;
    } else {
        return ShowInTypes.NICE3;
    }
};*/

export const getShowInTypeByDomain = (domain?: string) => {
  if (!domain) {
    domain = getHostUrl();
  }
  if (domain?.includes(educDomain())) {
    return ShowInTypes.NICE3;
  } else if (domain?.includes(learnerDomain())) {
    return ShowInTypes.LEARNER;
  } else {
    return ShowInTypes.TSP;
  }
};

const fbRegex1 = /\/videos\/([\w\-]*?)\//;
const fbRegex2 = /\/videos\/([\d]*?)\//;
const fbReplace = '/videos/';

export const getYoutubeUrl = (url: any) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const id = match && match[2].length === 11 ? match[2] : null;

  return `https://www.youtube.com/embed/${id}`;
};

export const getFacebookUrl = (url: any) => {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url.replace(
      fbRegex1,
      url.replace(fbRegex1, fbReplace) == url.replace(fbRegex2, fbReplace)
        ? '/videos/$1'
        : fbReplace,
    ),
  )}&width=500&height=280&show_text=false&appId`;
};

export const getVimeoUrl = (url: any) => {
  const vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const parsed = url.match(vimeoRegex);

  return '//player.vimeo.com/video/' + parsed[1];
};

export const getEmbeddedVideoUrl = (video_url: any) => {
  const domain = URL.parse(video_url);
  if (domain.host == 'www.youtube.com' || domain.host == 'youtu.be') {
    return getYoutubeUrl(video_url);
  } else if (domain.host == 'www.facebook.com') {
    return getFacebookUrl(video_url);
  } else if (domain.host == 'vimeo.com') {
    return getVimeoUrl(video_url);
  } else {
    return null;
  }
};

export const getInstituteIdByDomain = (cookies?: any) => {
  return cookies && cookies?.institute_id
    ? cookies.institute_id
    : getBrowserCookie(COOKIE_KEY_INSTITUTE_ID) || 40;
};

export const getErrorObject = (id: any, errorInstance: any) => {
  const keyArray = id
    .replaceAll('.', ',')
    .replaceAll('[', ',')
    .replaceAll(']', '')
    .split(',');
  let errorObj = errorInstance;
  keyArray.forEach((key: string) => {
    errorObj = errorObj?.[key];
  });
  return errorObj;
};

export const getCurrentDomain = () => {
  const origin = getHostUrl();
  if (typeof window != 'undefined') {
    const host = window?.location?.host;
    if (isLocalHost()) {
      if (origin?.includes(educDomain())) {
        return 'educ.com';
      } else if (origin?.includes(learnerDomain())) {
        return ' learner.educ.com';
      } else if (origin?.includes(industryDomain())) {
        return 'mcci.educ.com';
      } else if (origin?.includes(instituteDomain())) {
        return 'dyd.educ.com';
      }
    }
    return host;
  } else {
    return '';
  }
};

export const getFilteredQueryParams = (
  params: any,
  defaultPageSize: number,
  defaultPage: number,
) => {
  if (
    params.page_size &&
    (!Number(params.page_size) ||
      params.page_size < MIN_PAGE_SIZE ||
      params.page_size > MAX_PAGE_SIZE)
  ) {
    params.page_size = defaultPageSize;
  }

  if (params.page && !Number(params.page)) {
    params.page = defaultPage;
  }

  return params;
};

export const getMobilePhoneValidationSchema = (
  yup: any,
  regex: any,
  label: any,
) => {
  return yup.object().shape({
    value: yup
      .mixed()
      .test(
        'mobile_number_validation',
        label as string,
        (value: any) => !value || Boolean(value.match(regex)),
      ),
  });
};

export const getTimer = (expireTime: number) => {
  const time = new Date();
  let clearInterval = false;
  let remainingSec = Math.ceil((expireTime - time.getTime()) / 1000);
  let remainingMin = Math.floor(remainingSec / 60);
  remainingSec = remainingSec % 60;
  let remainingHour = Math.floor(remainingMin / 60);
  remainingMin = remainingMin % 60;
  if (remainingHour < 1 && remainingMin < 1 && remainingSec < 1) {
    clearInterval = true;
  }

  return {
    timer:
      (remainingHour < 10 ? '0' + remainingHour : remainingHour) +
      ':' +
      (remainingMin < 10 ? '0' + remainingMin : remainingMin) +
      ':' +
      (remainingSec < 10 ? '0' + remainingSec : remainingSec),
    clearInterval: clearInterval,
  };
};

export const isValidLatitude = (lat: any) => {
  return lat && isFinite(lat) && Math.abs(lat) <= 90;
};

export const isValidLongitude = (lng: any) => {
  return lng && isFinite(lng) && Math.abs(lng) <= 180;
};

export const convertEnglishDigitsToBengali = (digits: any) =>
  digits.replace(/\d/g, (number: any) => '০১২৩৪৫৬৭৮৯'[number]);

export const convertBengaliDigitsToEnglish = (digits: any) =>
  digits.replace(/\D/g, (number: any) => '০১২৩৪৫৬৭৮৯'.indexOf(number));

export const getCalculatedSerialNo = (
  index: number,
  page: number | null | undefined,
  size: number | null | undefined,
  locale?: string,
) => {
  let serial = page && size ? page * size + (index + 1) : index + 1;

  return locale == LocaleLanguage.BN
    ? convertEnglishDigitsToBengali(String(serial))
    : serial;
};

export const not = (a: any[], b: any[]) => {
  return a.filter((value) => b?.indexOf(value) === -1);
};

export const intersection = (checked: any[], dataList: any[]) => {
  return checked?.filter((value) => dataList?.indexOf(value) !== -1);
};

export const localizedNumbers: any = (num: string, local: any) => {
  return local == LocaleLanguage.BN
    ? convertEnglishDigitsToBengali(String(num))
    : num;
};
// Get localize year range
export const getLocalizeYearsRange = (
  yearFrom: number,
  locale: any,
  toYear?: number,
) => {
  const now = toYear ?? new Date().getUTCFullYear();
  const years = Array(now - yearFrom)
    .fill('')
    .map((v, idx) => now - idx);
  return years.map((item) => {
    return {
      id: item,
      year: localizedNumbers(item, locale),
    };
  });
};

// Get localize year-year range
export const getLocalizeYeartoYearRange = (yearFrom: number, locale: any) => {
  const now = new Date().getUTCFullYear();
  const years = Array(now - yearFrom)
    .fill('')
    .map((v, idx) => now - idx);
  return years.map((item) => {
    let previousYear = localizedNumbers(item, locale);
    let nextYear = localizedNumbers(item + 1, locale);
    return {
      id: item,
      year: `${item}-${item + 1}`,
      year_label: `${previousYear}-${nextYear}`,
    };
  });
};

// list of years array (from 2020 - current)
export const generateOfYears = (locale: any) => {
  const now = new Date().getUTCFullYear();
  const years = Array(now - 2019)
    .fill('')
    .map((v, idx) => now - idx);
  return years.map((item) => {
    return {
      key: item,
      label: localizedNumbers(item, locale),
    };
  });
};

export const getAllMonths = (
  formatDate: (
    value: Parameters<Intl.DateTimeFormat['format']>[0] | string,
    opts?: FormatDateOptions,
  ) => string,
): any[] => {
  let allMonths = [];
  for (let i = 0; i < 12; i++) {
    let date = new Date();
    date.setMonth(i);

    let formattedMonth = {
      id: i + 1,
      title: formatDate(date, {month: 'long'}),
    };
    allMonths.push(formattedMonth);
  }

  return allMonths;
};

export const getSmefId = (hostName: string) => {
  if (hostName.endsWith('educ.com')) {
    return 48;
  } else if (hostName.endsWith('staging.educee.com')) {
    return 3;
  } else if (hostName.endsWith('dev.educee.com')) {
    return 3;
  } else if (hostName.endsWith('educ.asm')) {
    return 3;
  }
};

export const getNascibId = (hostName: string) => {
  if (hostName.endsWith('educ.com')) {
    return 2;
  } else if (hostName.endsWith('staging.educee.com')) {
    return 2;
  } else if (hostName.endsWith('dev.educee.com')) {
    return 2;
  } else if (hostName.endsWith('educ.asm')) {
    return 2;
  }
};

export const getNUId = (hostName: string) => {
  if (hostName.endsWith('educ.com')) {
    return 53;
  } else if (hostName.endsWith('staging.educee.com')) {
    return 0;
  } else if (hostName.endsWith('dev.educee.com')) {
    return 4;
  } else if (hostName.endsWith('educ.asm')) {
    return 7;
  }
};

export const getNascibDomain = (hostName: string) => {
  if (hostName.endsWith('educ.com')) {
    return 'nascib.educ.com';
  } else if (hostName.endsWith('staging.educee.com')) {
    return 'nascib-staging.educee.com';
  } else if (hostName.endsWith('dev.educee.com')) {
    return 'nascib-dev.educee.com';
  } else if (hostName.endsWith('educ.asm')) {
    return 'nascib.educ.asm';
  }
};

export const urlParamsUpdate = (router: any, params: any) => {
  router.push(
    {
      pathname: router.pathname,
      query: params,
    },
    undefined,
    {shallow: true},
  );
};

export const getArrayColumn = (matrix: Array<any>, col: string) => {
  let column = [];
  for (let i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column; // return column data..
};

export const getColorScale = (
  fromValue: number,
  toValue: number,
  fromColor: string,
  toColor: string,
) => {
  return (
    scaleLinear()
      .domain([fromValue, toValue])
      // @ts-ignore
      ?.range([fromColor, toColor])
  );
};

export const getBDJobsApplyUrl = (jobId: string) => {
  return `https://jobs.bdjobs.com/JobOnlineApply.asp?JOAID=${jobId}&applyfrom=educ`;
};

export const SMEFDomains = [
  'smef.educ.com',
  'smef-staging.educee.com',
  'smef-dev.educee.com',
  'smef.educ.asm',
];
export const NUDomains = [
  'nu.educ.com',
  'nu-staging.educee.com',
  'nu-dev.educee.com',
  'nu.educ.asm',
];

export const NASCIBDomains = [
  'nascib.educ.com',
  'nascib-staging.educee.com',
  'nascib-dev.educee.com',
  'nascib.educ.asm',
];

export const DgnmDomains = [
  'dgnm.educ.com',
  'dgnm-staging.educee.com',
  'dgnm-dev.educee.com',
  'dgnm.educ.asm',
];

export const getIdentityNumberFieldCaptionKey = (
  identityNumberType: string | undefined,
) => {
  switch (String(identityNumberType)) {
    case IdentityNumberTypes.NID:
      return 'common.identity_type_nid';
    case IdentityNumberTypes.BIRTH_CERT:
      return 'common.identity_type_birth_cert';
    default:
      return 'common.identity_type_nid';
  }
};

export const getPartnersCategories = (messages: any) => {
  return [
    {
      code: PartnerCategories.Job_Provider,
      title: messages['common.job_provider'],
    },
    {
      code: PartnerCategories.Education_Partner,
      title: messages['common.education_partner'],
    },
    {
      code: PartnerCategories.Certificate_Authority,
      title: messages['certificate_authority.label'],
    },
  ];
};

export const getPartnersCategoriesV2 = (messages: any) => {
  return [
    {
      code: NewPartnerCategories.NATIONAL,
      title: messages['common.national_partner'],
    },
    {
      code: NewPartnerCategories.INTERNATIONAL,
      title: messages['common.international_partner'],
    },
  ];
};

export const getFormatMessage = (
  formatMessage: any,
  messageId: string,
  otherKeyValueObj: Record<string, any>,
) => {
  return formatMessage({id: messageId}, otherKeyValueObj);
};

export const getAllKeysFromErrorObj = (obj: Record<string, any>): string[] => {
  const keys: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key]?.message) {
      keys.push(key);
    } else if (typeof obj[key] === 'object') {
      keys.push(
        ...getAllKeysFromErrorObj(obj[key]).map(
          (subKey) => `${key}[${subKey}]`,
        ),
      );
    }
  }
  return keys;
};
