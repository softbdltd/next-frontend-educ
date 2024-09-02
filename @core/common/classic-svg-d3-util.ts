import * as d3 from 'd3';
import Religions from '../utilities/Religions';
import MaritalStatus from '../utilities/MaritalStatus';
import IdentityNumberTypes from '../utilities/IdentityNumberTypes';
import LocaleLanguage from '../utilities/LocaleLanguage';
import {ResultCodeAppeared} from '../../modules/learner/profile/utilities/EducationEnums';
import {convertEnglishDigitsToBengali} from '../utilities/helpers';
import {educDomain} from './constants';

interface IPosition {
  endY: number;
  x: number;
  y: number;
}

interface Id3Value {
  id: string;
  headline: string;
  body: string | any[];
  position: IPosition;
  height?: number;
  width?: number;
}

interface IcvPosition {
  rectDefaultWidth: number;
  rectDefaultHeight: number;
  startPositionX: number;
  startPositionY: number;
  headerHeight: number;
  lineHeight: number;
  maxLineSize: number;
  locale: string;
}

interface ITextDesign {
  headlineSize: number;
  bodyFontSize: number;
}

export enum RelationshipType {
  FATHER = '1',
  MOTHER = '2',
  LOCAL_GUARDIAN = '7',
}

interface IRenderSVG extends IcvPosition, ITextDesign {}

const textColor: string = '#231f20';
const headerLineColor: string = '#231f20';
const otherLineColor: string = '#bcbec0';
export const getProps = (propsName: string, locale: string): string => {
  return locale === LocaleLanguage.BN ? propsName : propsName + '_en';
};

const getCVData = (data: any, messages: any, options: IcvPosition) => {
  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  let d3Value = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (key == 'Objective') {
        d3Value.push({
          id: 'Objective',
          headline: data[key].headline,
          height: data[key].height,
          body: data[key].data,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'JobExperience' && data[key].height) {
        d3Value.push({
          id: 'JobExperience',
          headline: data[key].headline,
          height: data[key]?.height,
          body: data[key]?.body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'Education') {
        d3Value.push({
          id: 'Education',
          headline: messages['education.label'],
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'Skills') {
        d3Value.push({
          id: 'Skills',
          headline: messages['skill.label'],
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'LanguagesProficiencies' && data[key].height) {
        d3Value.push({
          id: 'LanguagesProficiencies',
          headline: messages['language_proficiency.title'],
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'Certifications' && data[key].height) {
        d3Value.push({
          id: 'Certifications',
          headline: messages['common.certificate'],
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'References' && data[key].height) {
        d3Value.push({
          id: 'References',
          headline: messages['references.label'],
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      } else if (key == 'PersonalInformation' && data[key].height) {
        d3Value.push({
          id: 'PersonalInformation',
          headline: data[key].headline,
          height: data[key].height,
          body: data[key].body,
          position: {x: rect.x, y: rect.y},
        });
      }
    }
  }

  let transformedD3ValueArray: any = [];

  let lastSegment: any;

  d3Value?.map((item, index) => {
    if (index > 0) {
      item.position.y =
        lastSegment.position.y +
        (lastSegment?.height ?? options.rectDefaultHeight);
    }
    transformedD3ValueArray.push(item);
    lastSegment = item;
  });
  return transformedD3ValueArray;
};

const getCVDataSize = (
  data: any,
  messages: any,
  options: IcvPosition,
  formatDate: any,
  formatNumber: any,
) => {
  // const textPadding: number = 10;
  const bottomPadding: number = 15;
  const additionalSpace: number = 35;

  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  let learnerBio = data[getProps('bio', options.locale)] ?? '';

  // Certifications
  let certificatesArray: any = [];
  let certificateLineCount = 0;

  (data?.learner_certifications || []).map((e: any) => {
    if (e.certificate_issued_id == null) {
      let duration = '';
      if (e.start_date && e.end_date) {
        duration += `${messages['common.start_date']}: ${formatDate(
          e.start_date,
        )}, ${messages['common.end_date']}: ${formatDate(e.end_date)}`;
      } else if (e.start_date && !e.end_date) {
        duration += `${messages['common.start_date']}: ${formatDate(
          e.start_date,
        )}`;
      } else if (!e.start_date && e.end_date) {
        duration += `${messages['common.end_date']}: ${formatDate(e.end_date)}`;
      }

      const certificateFirstLine = `• ${
        messages['certificate.certificate_title']
      }: ${e[getProps('certification_name', options.locale)]}, ${
        messages['common.location']
      }: ${e[getProps('location', options.locale)]}, ${
        messages['common.institute_name']
      }: ${e[getProps('institute_name', options.locale)]}, ${duration}`;

      let lines = Math.ceil(
        calculateLineCount(certificateFirstLine, options.maxLineSize),
      );
      certificateLineCount += lines;

      const certificateSecondLine = `${messages['common.certificate']}: ${process.env.NEXT_PUBLIC_FILE_SERVER_FILE_VIEW_ENDPOINT}${e.certificate_file_path}`;
      certificateLineCount += 1;

      certificatesArray.push(certificateFirstLine);
      certificatesArray.push(certificateSecondLine);
    } else {
      let duration = '';
      if (e.start_date && e.end_date) {
        duration += `${messages['common.start_date']}: ${formatDate(
          e.start_date,
        )}, ${messages['common.end_date']}: ${formatDate(e.end_date)}`;
      } else if (e.start_date && !e.end_date) {
        duration += `${messages['common.start_date']}: ${formatDate(
          e.start_date,
        )}`;
      } else if (!e.start_date && e.end_date) {
        duration += `${messages['common.end_date']}: ${formatDate(e.end_date)}`;
      }

      const certificateFirstLine = `• ${
        messages['certificate.certificate_title']
      }: ${e[getProps('certification_name', options.locale)]}, ${duration}`;

      let lines = Math.ceil(
        calculateLineCount(certificateFirstLine, options.maxLineSize),
      );
      certificateLineCount += lines;

      const certificateSecondLine = `${
        messages['common.certificate']
      }: ${educDomain()}/certificate-view/${e.certificate_issued_id}`;
      certificateLineCount += 1;

      certificatesArray.push(certificateFirstLine);
      certificatesArray.push(certificateSecondLine);
    }
  });

  // Personal Information

  let personalInfoArray: any = [];

  const father = data?.learner_guardians?.filter(
    (e: any) => e.relationship_type == RelationshipType.FATHER,
  );

  const mother = data?.learner_guardians?.filter(
    (e: any) => e.relationship_type == RelationshipType.MOTHER,
  );

  if (father.length > 0) {
    const fatherLine = `• ${messages['common.father_name']}: ${father[0].name}`;

    personalInfoArray.push(fatherLine);
  }

  if (mother.length > 0) {
    const motherLine = `• ${messages['common.mother_name']}: ${mother[0].name}`;

    personalInfoArray.push(motherLine);
  }
  if (data?.date_of_birth) {
    const dobLine = `• ${messages['common.date_of_birth']}: ${formatDate(
      data?.date_of_birth,
    )}`;

    personalInfoArray.push(dobLine);
  }
  if (data?.religion) {
    let religion;

    if (data?.religion == Religions.HINDUISM) {
      religion = messages['common.religion_hinduism'];
    } else if (data?.religion == Religions.ISLAM) {
      religion = messages['common.religion_islam'];
    } else if (data?.religion == Religions.CHRISTIANITY) {
      religion = messages['common.religion_christianity'];
    } else if (data?.religion == Religions.BUDDHISM) {
      religion = messages['common.religion_buddhism'];
    } else if (data?.religion == Religions.JUDAISM) {
      religion = messages['common.religion_judaism'];
    } else if (data?.religion == Religions.SIKHISM) {
      religion = messages['common.religion_sikhism'];
    } else if (data?.religion == Religions.ETHNIC) {
      religion = messages['common.religion_ethnic'];
    } else if (data?.religion == Religions.ATHEIST) {
      religion = messages['common.religion_atheist'];
    }

    const religionLine = `• ${messages['common.religion']}: ${religion}`;

    personalInfoArray.push(religionLine);
  }
  if (data?.marital_status) {
    let maritalStatusType;

    if (data?.marital_status == MaritalStatus.SINGLE) {
      maritalStatusType = messages['common.marital_status_single'];
    } else if (data?.marital_status == MaritalStatus.MARRIED) {
      maritalStatusType = messages['common.marital_status_married'];
    } else if (data?.marital_status == MaritalStatus.WIDOWED) {
      maritalStatusType = messages['common.marital_status_widowed'];
    } else if (data?.marital_status == MaritalStatus.DIVORCED) {
      maritalStatusType = messages['common.marital_status_divorced'];
    }

    const maritalStatusLine = `• ${messages['common.marital_status']}: ${maritalStatusType}`;

    personalInfoArray.push(maritalStatusLine);
  }
  if (data?.identity_number_type && data?.identity_number) {
    let identityType;

    if (data?.identity_number_type == IdentityNumberTypes.NID) {
      identityType = messages['common.identity_type_nid'];
    } else if (data?.identity_number_type == IdentityNumberTypes.BIRTH_CERT) {
      identityType = messages['common.identity_type_birth_cert'];
    } else if (data?.identity_number_type == IdentityNumberTypes.PASSPORT) {
      identityType = messages['common.identity_type_passport'];
    }

    const idLine = `• ${identityType}: ${formatNumber(data?.identity_number, {
      useGrouping: false,
    })}`;
    personalInfoArray.push(idLine);
  }

  // Job Experiences
  const jobExperienceData = (data?.learner_job_experiences || []).map(
    (e: any, i: number) => {
      let duration = '';
      if (e.is_currently_working) {
        duration += messages['common.present'];
      } else {
        duration += `${messages['common.start_date']}: ${formatDate(
          e.start_date,
        )}, ${messages['common.end_date']}: ${formatDate(e.end_date)}`;
      }
      return `• ${messages['common.company_name']}: ${
        e[getProps('company_name', options.locale)]
      }, ${messages['common.designation']}: ${
        e[getProps('position', options.locale)]
      }, ${duration}`;
    },
  );

  // Education
  const educationData = (data?.learner_educations || []).map(
    (e: any, i: number) => {
      let resultTxt = `${messages['education.result']}: `;
      let duration = e.duration
        ? `, ${messages['education.duration']}: ${
            formatNumber(e.duration) || ''
          }`
        : ``;
      if (e.cgpa) {
        resultTxt += ` ${formatNumber(e.cgpa)}`;
      } else {
        resultTxt += ` ${
          e.result ? e.result[getProps('title', options.locale)] : ''
        }`;
      }
      let passingYear = `${
        e.result?.code != ResultCodeAppeared
          ? messages['education.passing_year']
          : messages['education.expected_passing_year']
      }: ${
        e.result?.code != ResultCodeAppeared
          ? e.year_of_passing
            ? formatNumber(e.year_of_passing, {
                useGrouping: false,
              })
            : ''
          : e.expected_year_of_passing
          ? formatNumber(e.expected_year_of_passing, {
              useGrouping: false,
            })
          : ''
      }`;

      return `• ${messages['common.institute_name']}: ${
        e[getProps('institute_name', options.locale)]
      }${duration}${e.result ? ', ' + resultTxt : ''}${
        e.result ? ', ' + passingYear : ''
      }`;
    },
  );

  // Skills
  const skillsData = (data?.skills || []).map((e: any, i: number) => {
    return `• ${e[getProps('title', options.locale)]}`;
  });

  // LanguagesProficiencies

  const languagesData = (data?.learner_languages_proficiencies || []).map(
    (e: any) => {
      return `• ${messages['language.label']}: ${
        e[getProps('language_title', options.locale)]
      }, ${messages['language.read']}: ${
        e.reading_proficiency_level
          ? messages['common.easily']
          : messages['common.easily']
      }, ${messages['language.write']}: ${
        e.writing_proficiency_level
          ? messages['common.easily']
          : messages['common.not_easily']
      }, ${messages['language.speak']}: ${
        e.speaking_proficiency_level
          ? messages['common.fluent']
          : messages['common.not_fluent']
      }`;
    },
  );

  // References
  const referenceData = (data?.learner_references || []).map(
    (e: any, i: number) => {
      let mobile =
        options.locale === LocaleLanguage.BN
          ? convertEnglishDigitsToBengali(e.referrer_mobile)
          : e.referrer_mobile;
      return `• ${messages['learner.fullName']}: ${
        e[getProps('referrer_first_name', options.locale)]
      } ${e[getProps('referrer_last_name', options.locale)]}, ${
        messages['common.email']
      }: ${e.referrer_email}, ${messages['common.phone']}: ${mobile}, ${
        messages['common.organization_name']
      }: ${e[getProps('referrer_organization_name', options.locale)]}`;
    },
  );

  const lineCountCalculate = (array: any) => {
    let lineCounts = 0;
    (array || []).map((item: any) => {
      const lineCount = calculateLineCount(item, options.maxLineSize);
      lineCounts += lineCount;
    });
    return lineCounts == 0 ? 1 : lineCounts;
  };

  const d3PageValue = [
    {
      id: 'Objective',
      headline: messages['common.objective'],
      height:
        calculateLineCount(learnerBio, options.maxLineSize) * 17 +
        additionalSpace +
        bottomPadding,
      body: learnerBio,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: learnerBio,
    },
    {
      id: 'JobExperience',
      headline: messages['common.job_experience'],
      height:
        jobExperienceData.length === 0
          ? 0
          : lineCountCalculate(jobExperienceData) * options.lineHeight +
            additionalSpace,
      body: jobExperienceData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: data?.learner_job_experiences,
    },
    {
      id: 'Education',
      headline: messages['education.label'],
      height:
        lineCountCalculate(educationData) * options.lineHeight +
        additionalSpace,
      body: educationData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: data?.learner_educations,
    },
    {
      id: 'Skills',
      headline: messages['skill.label'],
      height:
        lineCountCalculate(skillsData) * options.lineHeight + additionalSpace,
      body: skillsData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: data?.skills,
    },
    {
      id: 'LanguagesProficiencies',
      headline: messages['language_proficiency.title'],
      height:
        certificatesArray.length === 0
          ? 0
          : lineCountCalculate(languagesData) * options.lineHeight +
            additionalSpace,
      body: languagesData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: languagesData,
    },
    {
      id: 'Certifications',
      headline: messages['common.certificate'],
      height:
        certificatesArray.length === 0
          ? 0
          : (certificateLineCount || 2) * options.lineHeight + additionalSpace,
      body: certificatesArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: certificatesArray,
    },
    {
      id: 'References',
      headline: messages['references.label'],
      height:
        referenceData.length === 0
          ? 0
          : lineCountCalculate(referenceData) * options.lineHeight +
            additionalSpace,
      body: referenceData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: referenceData,
    },
    {
      id: 'PersonalInformation',
      headline: messages['personal_info.label'],
      height:
        lineCountCalculate(personalInfoArray) * options.lineHeight +
        additionalSpace,
      body: personalInfoArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: personalInfoArray,
    },
    {
      id: 'dummy',
      headline: 'dummy',
      height: options.lineHeight + additionalSpace,
      body: learnerBio,
      position: {x: rect.x, y: rect.y, endY: 0},
    },
  ];

  const objective = d3PageValue.filter((item) => item.id == 'Objective')[0];
  const experience = d3PageValue.filter(
    (item) => item.id == 'JobExperience',
  )[0];

  const education = d3PageValue.filter((item) => item.id == 'Education')[0];
  const skills = d3PageValue.filter(
    (item) => item.id == 'Skills',
  )[0] as Id3Value;
  const languages_proficiencies = d3PageValue.filter(
    (item) => item.id == 'LanguagesProficiencies',
  )[0] as Id3Value;
  const certifications = d3PageValue.filter(
    (item) => item.id == 'Certifications',
  )[0] as Id3Value;
  const references = d3PageValue.filter((item) => item.id == 'References')[0];
  const personalInfo = d3PageValue.filter(
    (item) => item.id == 'PersonalInformation',
  )[0] as Id3Value;
  const dummy = d3PageValue.filter((item) => item.id == 'dummy')[0] as Id3Value;

  experience.position.y =
    objective.position.y + (objective?.height ?? options.rectDefaultHeight);

  objective.position.endY = experience.position.y;

  education.position.y =
    experience.position.y + (experience?.height ?? options.rectDefaultHeight);

  experience.position.endY = education.position.y;

  skills.position.y =
    education.position.y + (education?.height ?? options.rectDefaultHeight);

  education.position.endY = skills.position.y;

  languages_proficiencies.position.y =
    skills.position.y + (skills?.height ?? options.rectDefaultHeight);

  skills.position.endY = languages_proficiencies.position.y;

  certifications.position.y =
    languages_proficiencies.position.y +
    (languages_proficiencies?.height ?? options.rectDefaultHeight);

  languages_proficiencies.position.endY = certifications.position.y;

  references.position.y =
    certifications.position.y +
    (certifications?.height ?? options.rectDefaultHeight);

  certifications.position.endY = references.position.y;

  personalInfo.position.y =
    references.position.y + (references?.height ?? options.rectDefaultHeight);

  references.position.endY = personalInfo.position.y;

  dummy.position.y =
    personalInfo.position.y +
    (personalInfo?.height ?? options.rectDefaultHeight);

  personalInfo.position.endY = dummy.position.y;

  let lastSegmentEndY = 0;
  let final3DValueArray: any = [];

  d3PageValue?.map((item) => {
    if (item.position.endY / 812 >= 1) {
      item.position.endY += 812 - lastSegmentEndY;
    } else {
      lastSegmentEndY = item.position.endY;
    }
    final3DValueArray.push(item);
  });

  return final3DValueArray;
};

const calculateLineCount = (text: string, maxLineSize: number) => {
  let lines: any[] = [],
    line: any[] = [];

  text.split(' ').forEach(function (word) {
    line.push(word);
    const textForm = line.join(' ');

    if (textForm.length > maxLineSize) {
      line.pop();
      lines.push(line.join(' '));
      line = [word];
    }
  });

  lines.push(line.join(' '));

  return lines.length;
};

const renderSVG = (data: any, options: IRenderSVG, index: number) => {
  const dthree = d3.select(`g[id="cv-body${index}"]`);
  const allSections = dthree.selectAll('g').data(data).enter();

  // rectangle
  allSections
    .append('rect')
    .attr('x', options.startPositionX)
    .attr('y', (e: any) => {
      return e.position.y;
    })
    .attr('width', options.rectDefaultWidth)
    .attr('height', (d: any) => {
      return d.height || options.rectDefaultHeight;
    })
    .attr('fill', 'transparent');
  // .attr('fill', '#ccc')

  // headline
  allSections
    .append('g')
    .append('text')
    .attr('y', (e: any) => {
      return e.position.y;
    })
    .attr('x', (e: any) => {
      return e.position.x;
    })
    .text((txt: any) => {
      return txt.headline;
    })
    .attr('font-size', options.headlineSize);
  const lineBottomSpace = 5;

  // Lines
  allSections
    .append('line')
    .attr('x1', (e: any) => {
      return e.position.x;
    })
    .attr('y1', (e: any) => {
      return e.position.y + lineBottomSpace;
    })
    .attr('x2', (e: any) => {
      return e.position.x + options.rectDefaultWidth;
    })
    .attr('y2', (e: any) => {
      return e.position.y + lineBottomSpace;
    })
    .attr('style', 'stroke:#bcbec0;stroke-width:1');

  // body
  const textElem = allSections
    .append('text')
    .attr('y', (e: any) => {
      return e.position.y + options.headerHeight;
    })
    .attr('x', (e: any) => {
      return e.position.x;
    });

  textElem
    .text((txt: any) => {
      if (!Array.isArray(txt.body)) {
        return txt.body;
      }
    })
    .attr('font-size', options.bodyFontSize)
    .attr('fill', textColor)
    .call(wrap, options.rectDefaultWidth);

  allSections
    .filter((d: any) => {
      return Array.isArray(d.body);
    })
    // .enter()
    .append('g')
    .attr('y', (e: any) => {
      return e.position.y + options.headerHeight;
    })
    .attr('x', (e: any) => {
      return e.position.x;
    })
    .attr('font-size', options.bodyFontSize)
    .attr('fill', textColor)
    .call(
      setArrayText,
      options.rectDefaultWidth,
      options.lineHeight,
      options.maxLineSize,
    );
};

export const getStructureData = (
  data: any,
  messages: any,
  locale: any,
  index: number,
) => {
  let startPositionX: number;
  let startPositionY: number;
  let rectDefaultWidth: number;
  let rectDefaultHeight: number;
  let headerHeight: number;
  let bodyFontSize: number;
  let headlineSize: number;
  let lineHeight: number;
  let maxLineSize: number;

  if (index == 0) {
    startPositionX = 18;
    startPositionY = 220;
    rectDefaultWidth = 560;
    rectDefaultHeight = 100;
    headerHeight = 20;
    bodyFontSize = 11;
    headlineSize = 14;
    lineHeight = 18;
    maxLineSize = locale == LocaleLanguage.EN ? 105 : 110;
  } else {
    startPositionX = 18;
    startPositionY = 45;
    rectDefaultWidth = 560;
    rectDefaultHeight = 100;
    headerHeight = 20;
    bodyFontSize = 11;
    headlineSize = 14;
    lineHeight = 18;
    maxLineSize = locale == LocaleLanguage.EN ? 105 : 110;
  }

  const cvDataOptions = {
    headerHeight: headerHeight,
    rectDefaultHeight: rectDefaultHeight,
    rectDefaultWidth: rectDefaultWidth,
    bodyFontSize: bodyFontSize,
    headlineSize: headlineSize,
    startPositionX: startPositionX,
    startPositionY: startPositionY,
    lineHeight: lineHeight,
    maxLineSize: maxLineSize,
    locale: locale,
  };

  const d3Value = getCVData(data, messages, cvDataOptions);

  renderSVG(
    d3Value,
    {
      ...cvDataOptions,
      ...{
        bodyFontSize: bodyFontSize,
        headlineSize: headlineSize,
      },
    },
    index,
  );
};

export const getD3ValueByPage = (
  data: any,
  messages: any,
  locale: any,
  formatDate: any,
  formatNumber: any,
) => {
  const startPositionX: number = 18;
  const startPositionY: number = 220;
  const rectDefaultWidth: number = 560;
  const rectDefaultHeight: number = 100;
  const headerHeight: number = 20;
  const bodyFontSize: number = 11;
  const headlineSize: number = 14;
  const lineHeight = 18;
  const maxLineSize = locale == LocaleLanguage.EN ? 105 : 110;

  const cvDataOptions = {
    headerHeight: headerHeight,
    rectDefaultHeight: rectDefaultHeight,
    rectDefaultWidth: rectDefaultWidth,
    startPositionX: startPositionX,
    startPositionY: startPositionY,
    lineHeight: lineHeight,
    bodyFontSize: bodyFontSize,
    headlineSize: headlineSize,
    maxLineSize: maxLineSize,
    locale: locale,
  };

  const d3PageValue = getCVDataSize(
    data,
    messages,
    cvDataOptions,
    formatDate,
    formatNumber,
  );

  let d3ValueArray: any = [];
  d3PageValue?.map((item: any) => {
    const pageIndex = Math.floor(item.position.endY / 812);
    d3ValueArray[pageIndex] = {
      ...(d3ValueArray[pageIndex] || {}),
      [item?.id]: item,
    };
  });

  return d3ValueArray;
};

export const generateLineFomDomPosition = (
  position: any,
  isHeader: boolean,
) => {
  const generateLineColor = isHeader ? headerLineColor : otherLineColor;
  d3.select('#cv-header')
    .append('path')
    .attr('fill', generateLineColor)
    .attr(
      'd',
      `M${position.x},${position.height + position.y}v-.9H${
        position.x + position.width
      }v.9Z`,
    );
};

function setArrayText(
  txtElem: any,
  width: number,
  lineHeight: number,
  maxLineSize: number,
) {
  txtElem.each(function (e: any) {
    // @ts-ignore: Implicit This
    let txtElem = d3.select(this);
    let lineNo = 1;
    for (let i = 0; i < e.body.length; i++) {
      const element = `${e.body[i]}`;
      let l = calculateLineCount(element, maxLineSize);
      txtElem
        .append('text')
        .attr('y', (e: any) => {
          return e.position.y + lineHeight * lineNo;
        })
        .attr('x', (e: any) => {
          return e.position.x;
        })
        .text(element)
        .call(wrap, width);
      lineNo += l;
    }
  });
}

function wrap(text: any, width: any) {
  text.each(function () {
    // @ts-ignore: Implicit This
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line: any[] = [],
      lineNumber = 0,
      lineHeight = 1.7, // ems
      x = text.attr('x'),
      y = text.attr('y'),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      // @ts-ignore: tspan nullable
      if (tspan && tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}
