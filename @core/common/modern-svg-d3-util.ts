import * as d3 from 'd3';
import Religions from '../utilities/Religions';
import MaritalStatus from '../utilities/MaritalStatus';
import IdentityNumberTypes from '../utilities/IdentityNumberTypes';
import LocaleLanguage from '../utilities/LocaleLanguage';
import {ResultCodeAppeared} from '../../modules/learner/profile/utilities/EducationEnums';
import {areaText} from './svg-utils';
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

const bodyTextColor: string = '#231f20';
const sidebarTextColor: string = '#fff';
const lineColor: string = bodyTextColor;

export const getProps = (propsName: string, locale: string): string => {
  return locale === LocaleLanguage.BN ? propsName : propsName + '_en';
};

const getCVSidebarData = (data: any, messages: any, options: IcvPosition) => {
  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  let d3Value = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (key == 'Skills') {
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

const getCVBodyData = (data: any, messages: any, options: IcvPosition) => {
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

const getCVSidebarDataSize = (
  data: any,
  messages: any,
  options: IcvPosition,
  formatDate: any,
  formatNumber: any,
) => {
  const additionalSpace: number = 60;

  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  const lineCountCalculate = (array: any) => {
    let lineCounts = 0;
    (array || []).map((item: any) => {
      const lineCount = calculateLineCount(item, options.maxLineSize);
      lineCounts += lineCount;
    });
    return lineCounts;
  };

  // Skills
  const skillsData = (data?.skills || []).map((e: any, i: number) => {
    return `• ${e[getProps('title', options.locale)]}`;
  });

  // Language Proficiencies

  const languageProficienciesData = (
    data?.learner_languages_proficiencies || []
  ).map((e: any) => {
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

  const d3PageValue = [
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
        languageProficienciesData.length === 0
          ? 0
          : lineCountCalculate(languageProficienciesData) * options.lineHeight +
            additionalSpace,
      body: languageProficienciesData,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: languageProficienciesData,
    },
    {
      id: 'PersonalInformation',
      headline: messages['personal_info.label'],
      height:
        personalInfoArray.length === 0
          ? 0
          : lineCountCalculate(personalInfoArray) * options.lineHeight +
            additionalSpace,
      body: personalInfoArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: personalInfoArray,
    },
    {
      id: 'dummy',
      headline: 'dummy',
      height: options.lineHeight + additionalSpace,
      body: '',
      position: {x: rect.x, y: rect.y, endY: 0},
    },
  ];

  const skills = d3PageValue.filter(
    (item) => item.id == 'Skills',
  )[0] as Id3Value;
  const languages_proficiencies = d3PageValue.filter(
    (item) => item.id == 'LanguagesProficiencies',
  )[0] as Id3Value;
  const personalInfo = d3PageValue.filter(
    (item) => item.id == 'PersonalInformation',
  )[0] as Id3Value;
  const dummy = d3PageValue.filter((item) => item.id == 'dummy')[0] as Id3Value;

  languages_proficiencies.position.y =
    skills.position.y + (skills?.height ?? options.rectDefaultHeight);

  skills.position.endY = languages_proficiencies.position.y;

  personalInfo.position.y =
    languages_proficiencies.position.y +
    (languages_proficiencies?.height ?? options.rectDefaultHeight);

  languages_proficiencies.position.endY = personalInfo.position.y;

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

const getCVBodyDataSize = (
  data: any,
  messages: any,
  options: IcvPosition,
  formatDate: any,
  formatNumber: any,
) => {
  // const textPadding: number = 10;
  const bottomPadding: number = 15;
  const additionalSpace: number = 60;

  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  let learnerBio = data[getProps('bio', options.locale)] ?? '';

  // Certifications
  let certificatesArray: any = [];

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
      }: ${e[getProps('location', options.locale)]}, ${duration}`;

      const certificateSecondLine = `${messages['common.certificate']}: ${process.env.NEXT_PUBLIC_FILE_SERVER_FILE_VIEW_ENDPOINT}${e.certificate_file_path}`;

      const generateFirstCertificateGroupLine = calculateGroupLineCount(
        certificateFirstLine,
        options.maxLineSize,
      );
      const generateSecondCertificateGroupLine = calculateGroupLineCount(
        certificateSecondLine,
        options.maxLineSize,
      );

      generateFirstCertificateGroupLine?.map((item: any) => {
        certificatesArray.push(item.trim());
      });

      generateSecondCertificateGroupLine
        ?.filter((item) => item !== '')
        .map((item: any) => {
          certificatesArray.push(item.trim());
        });
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

      const certificateSecondLine = `${
        messages['common.certificate']
      }: ${educDomain()}/certificate-view/${e.certificate_issued_id}`;

      const generateFirstCertificateGroupLine = calculateGroupLineCount(
        certificateFirstLine,
        options.maxLineSize,
      );
      const generateSecondCertificateGroupLine = calculateGroupLineCount(
        certificateSecondLine,
        options.maxLineSize,
      );

      generateFirstCertificateGroupLine?.map((item: any) => {
        certificatesArray.push(item.trim());
      });

      generateSecondCertificateGroupLine?.map((item: any) => {
        certificatesArray.push(item.trim());
      });
    }
  });

  // Job Experiences
  let jobExperienceDataArray: any[] = [];
  (data?.learner_job_experiences || []).map((e: any, i: number) => {
    let duration = '';
    if (e.is_currently_working) {
      duration += messages['common.present'];
    } else {
      duration += `${messages['common.start_date']}: ${formatDate(
        e.start_date,
      )}, ${messages['common.end_date']}: ${formatDate(e.end_date)}`;
    }
    const experienceLine = `• ${messages['common.company_name']}: ${
      e[getProps('company_name', options.locale)]
    }, ${messages['common.designation']}: ${
      e[getProps('position', options.locale)]
    }, ${duration}`;

    const generateExperienceGroupLine = calculateGroupLineCount(
      experienceLine,
      options.maxLineSize,
    );

    generateExperienceGroupLine?.map((item: any) => {
      jobExperienceDataArray.push(item.trim());
    });
  });

  // Education
  let educationDataArray: any[] = [];
  (data?.learner_educations || []).map((e: any, i: number) => {
    let resultTxt = `${messages['education.result']}: `;
    let duration = e.duration
      ? `, ${messages['education.duration']}: ${formatNumber(e.duration) || ''}`
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

    const educationLine = `• ${messages['common.institute_name']}: ${
      e[getProps('institute_name', options.locale)]
    }${duration}${e.result ? ', ' + resultTxt : ''}${
      e.result ? ', ' + passingYear : ''
    }`;

    const generateEducationGroupLine = calculateGroupLineCount(
      educationLine,
      options.maxLineSize,
    );

    generateEducationGroupLine?.map((item: any) => {
      educationDataArray.push(item.trim());
    });
  });

  // References
  let referenceDataArray: any = [];
  (data?.learner_references || []).map((e: any, i: number) => {
    let mobile =
      options.locale === LocaleLanguage.BN
        ? convertEnglishDigitsToBengali(e.referrer_mobile)
        : e.referrer_mobile;
    const referenceLine = `• ${messages['learner.fullName']}: ${
      e[getProps('referrer_first_name', options.locale)]
    } ${e[getProps('referrer_last_name', options.locale)]}, ${
      messages['common.email']
    }: ${e.referrer_email}, ${messages['common.phone']}: ${mobile}, ${
      messages['common.organization_name']
    }: ${e[getProps('referrer_organization_name', options.locale)]}`;

    const generateReferenceGroupLine = calculateGroupLineCount(
      referenceLine,
      options.maxLineSize,
    );

    generateReferenceGroupLine?.map((item: any) => {
      referenceDataArray.push(item.trim());
    });
  });

  const lineCountCalculate = (array: any) => {
    let lineCounts = 0;
    (array || []).map((item: any) => {
      const lineCount = calculateLineCount(item, options.maxLineSize);
      lineCounts += lineCount;
    });
    return lineCounts;
  };

  const d3PageValue = [
    {
      id: 'Objective',
      headline: messages['common.objective'],
      height:
        calculateLineCount(learnerBio, options.maxLineSize) * 15 +
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
        jobExperienceDataArray.length === 0
          ? 0
          : lineCountCalculate(jobExperienceDataArray) * options.lineHeight +
            additionalSpace,
      body: jobExperienceDataArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: jobExperienceDataArray,
    },
    {
      id: 'Education',
      headline: messages['education.label'],
      height:
        lineCountCalculate(educationDataArray) * options.lineHeight +
        additionalSpace,
      body: educationDataArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: educationDataArray,
    },
    {
      id: 'Certifications',
      headline: messages['common.certificate'],
      height:
        certificatesArray.length === 0
          ? 0
          : lineCountCalculate(certificatesArray) * options.lineHeight +
            additionalSpace,
      body: certificatesArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: certificatesArray,
    },
    {
      id: 'References',
      headline: messages['references.label'],
      height:
        referenceDataArray.length === 0
          ? 0
          : lineCountCalculate(referenceDataArray) * options.lineHeight +
            additionalSpace,
      body: referenceDataArray,
      position: {x: rect.x, y: rect.y, endY: 0},
      data: referenceDataArray,
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

  const certifications = d3PageValue.filter(
    (item) => item.id == 'Certifications',
  )[0] as Id3Value;
  const references = d3PageValue.filter((item) => item.id == 'References')[0];

  const dummy = d3PageValue.filter((item) => item.id == 'dummy')[0] as Id3Value;

  experience.position.y =
    objective.position.y + (objective?.height ?? options.rectDefaultHeight);

  objective.position.endY = experience.position.y;

  education.position.y =
    experience.position.y + (experience?.height ?? options.rectDefaultHeight);

  experience.position.endY = education.position.y;

  certifications.position.y =
    education.position.y + (education?.height ?? options.rectDefaultHeight);

  education.position.endY = certifications.position.y;

  references.position.y =
    certifications.position.y +
    (certifications?.height ?? options.rectDefaultHeight);

  certifications.position.endY = references.position.y;

  dummy.position.y =
    references.position.y + (references?.height ?? options.rectDefaultHeight);

  references.position.endY = dummy.position.y;

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

const renderSVG = (
  data: any,
  options: IRenderSVG,
  index: number | string,
  isSidebar?: boolean,
) => {
  let dthree;

  if (isSidebar) dthree = d3.select(`g[id="cv-sidebar${index}"]`);
  else dthree = d3.select(`g[id="cv-body${index}"]`);

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
    .attr('font-size', options.headlineSize)
    .attr('font-weight', 'semi-bold');

  // Lines
  const lineBottomSpace = 10;
  if (isSidebar) {
    allSections
      .append('line')
      .attr('x1', (e: any) => {
        return e.position.x;
      })
      .attr('y1', (e: any) => {
        return e.position.y + lineBottomSpace;
      })
      .attr('x2', () => {
        return options.rectDefaultWidth;
      })
      .attr('y2', (e: any) => {
        return e.position.y + lineBottomSpace;
      })
      .attr('style', 'stroke:#fffdfb;stroke-width:2.5');
  } else {
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
      .attr('style', 'stroke:#1c1f26;stroke-width:1.5');
  }

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
    .attr('x', (e: any) => {
      return e.position.x + 5;
    })
    .attr('y', (e: any) => {
      return e.position.y + 30;
    })
    .attr('font-size', options.bodyFontSize)
    .attr('fill', isSidebar ? sidebarTextColor : bodyTextColor)
    .call(wrap, options.rectDefaultWidth - 10);

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
    .attr('fill', isSidebar ? sidebarTextColor : bodyTextColor)
    .call(
      setArrayText,
      options.rectDefaultWidth,
      options.lineHeight,
      options.maxLineSize,
    );
};

// const renderText = (data: any, options: IRenderSVG, index: number | string, isSidebar?:boolean) => {
//   let dthree;
//
//   if(isSidebar)
//     dthree = d3.select(`g[id="cv-sidebar${index}"]`);
//   else
//     dthree = d3.select(`g[id="cv-body${index}"]`);
//
//   const allSections = dthree.selectAll('g').data(data).enter();
//
//
//   // rectangle
//   allSections
//       .append('rect')
//       .attr('x', options.startPositionX)
//       .attr('y', (e: any) => {
//         return e.position.y;
//       })
//       .attr('width', options.rectDefaultWidth)
//       .attr('height', (d: any) => {
//         return d.height || options.rectDefaultHeight;
//       })
//       .attr('fill', 'transparent');
//
//
//   // body
//   const textElem = allSections
//       .append('text')
//       .attr('y', (e: any) => {
//         return e.position.y + options.headerHeight;
//       })
//       .attr('x', (e: any) => {
//         return e.position.x;
//       });
//
//   textElem
//       .text((txt: any) => {
//         if (!Array.isArray(txt.body)) {
//           return txt.body;
//         }
//       })
//       .attr('x', (e: any) => {
//         return e.position.x + 5;
//       })
//       .attr('y', (e: any) => {
//         return e.position.y + 30;
//       })
//       .attr('font-size', options.bodyFontSize)
//       .attr('fill', isSidebar?sidebarTextColor:bodyTextColor)
//       .call(wrap, options.rectDefaultWidth-10);
//
//   allSections
//       .filter((d: any) => {
//         return Array.isArray(d.body);
//       })
//       // .enter()
//       .append('g')
//       .attr('y', (e: any) => {
//         return e.position.y + options.headerHeight;
//       })
//       .attr('x', (e: any) => {
//         return e.position.x;
//       })
//       .attr('font-size', options.bodyFontSize)
//       .attr('fill', isSidebar?sidebarTextColor:bodyTextColor)
//       .call(
//           setArrayText,
//           options.rectDefaultWidth,
//           options.lineHeight,
//           options.maxLineSize,
//       );
// };

export const getStructureData = (
  data: any,
  messages: any,
  locale: any,
  index: number,
) => {
  let startPositionX: number = 18;
  let startPositionY: number = 220;
  let rectDefaultWidth: number = 560;
  let rectDefaultHeight: number = 100;
  let headerHeight: number = 20;
  let bodyFontSize: number = 11;
  let headlineSize: number = bodyFontSize + 3;
  let lineHeight = 18;
  let maxLineSize = 110;

  const cvDataOptions = {
    startPositionX: startPositionX,
    startPositionY: startPositionY,
    rectDefaultWidth: rectDefaultWidth,
    rectDefaultHeight: rectDefaultHeight,
    headerHeight: headerHeight,
    bodyFontSize: bodyFontSize,
    headlineSize: headlineSize,
    lineHeight: lineHeight,
    maxLineSize: maxLineSize,
    locale: locale,
  };

  const sidebarMaxLineSizeForLang = locale == 'en-US' ? 32 : 29;
  const bodyMaxLineSizeForLang = locale == 'en-US' ? 70 : 78;

  let cvSidebarDataOptions: any;
  if (index == 0 && data?.sidebar) {
    cvSidebarDataOptions = {
      ...cvDataOptions,
      headlineSize: 17,
      startPositionY: 390,
      maxLineSize: sidebarMaxLineSizeForLang,
      rectDefaultWidth: 180,
    };
  } else if (index > 0 && data?.sidebar) {
    cvSidebarDataOptions = {
      ...cvDataOptions,
      headlineSize: 17,
      startPositionY: 45,
      maxLineSize: sidebarMaxLineSizeForLang,
      rectDefaultWidth: 180,
    };
  } else {
    cvSidebarDataOptions = {...cvDataOptions};
  }

  let cvBodyDataOptions: any;
  if (index == 0 && data?.body) {
    cvBodyDataOptions = {
      ...cvDataOptions,
      headlineSize: 18,
      startPositionX: 233,
      startPositionY: 90,
      maxLineSize: bodyMaxLineSizeForLang,
      rectDefaultWidth: 350,
    };
  } else if (index > 0 && data?.body) {
    cvBodyDataOptions = {
      ...cvDataOptions,
      headlineSize: 18,
      startPositionX: 233,
      startPositionY: 45,
      maxLineSize: bodyMaxLineSizeForLang,
      rectDefaultWidth: 350,
    };
  } else {
    cvBodyDataOptions = {...cvDataOptions};
  }

  const d3SidebarValue = getCVSidebarData(
    data?.sidebar,
    messages,
    cvSidebarDataOptions,
  );

  const d3BodyValue = getCVBodyData(data?.body, messages, cvBodyDataOptions);

  renderSVG(
    d3SidebarValue,
    {
      ...cvSidebarDataOptions,
    },
    index,
    true,
  );

  renderSVG(
    d3BodyValue,
    {
      ...cvBodyDataOptions,
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
  let startPositionX: number = 18;
  let startPositionY: number = 220;
  let rectDefaultWidth: number = 560;
  let rectDefaultHeight: number = 100;
  let headerHeight: number = 20;
  let bodyFontSize: number = 11;
  let headlineSize: number = 14;
  let lineHeight = 18;
  let maxLineSize = 110;

  const cvDataOptions = {
    startPositionX: startPositionX,
    startPositionY: startPositionY,
    rectDefaultWidth: rectDefaultWidth,
    rectDefaultHeight: rectDefaultHeight,
    headerHeight: headerHeight,
    bodyFontSize: bodyFontSize,
    headlineSize: headlineSize,
    lineHeight: lineHeight,
    maxLineSize: maxLineSize,
    locale: locale,
  };

  const sidebarMaxLineSizeForLang = locale == LocaleLanguage.EN ? 32 : 29;
  const bodyMaxLineSizeForLang = locale == LocaleLanguage.EN ? 65 : 75;

  const cvSidebarDataOptions = {
    ...cvDataOptions,
    headlineSize: 17,
    startPositionY: 320,
    maxLineSize: sidebarMaxLineSizeForLang,
    rectDefaultWidth: 180,
  };
  const cvBodyDataOptions = {
    ...cvDataOptions,
    headlineSize: 18,
    startPositionX: 233,
    startPositionY: 90,
    maxLineSize: bodyMaxLineSizeForLang,
    rectDefaultWidth: 350,
  };

  const d3pageSidebarValue = getCVSidebarDataSize(
    data,
    messages,
    cvSidebarDataOptions,
    formatDate,
    formatNumber,
  );
  const d3pageBodyValue = getCVBodyDataSize(
    data,
    messages,
    cvBodyDataOptions,
    formatDate,
    formatNumber,
  );

  let d3ValueArray: any = [];
  d3pageSidebarValue?.map((item: any) => {
    const pageIndex = Math.floor(item.position.endY / 812);
    d3ValueArray[pageIndex] = {
      sidebar: {
        ...(d3ValueArray[pageIndex]?.['sidebar'] || {}),
        [item?.id]: item,
      },
    };
  });

  d3pageBodyValue?.map((item: any) => {
    const pageIndex = Math.floor(item.position.endY / 812);
    d3ValueArray[pageIndex] = {
      ...d3ValueArray[pageIndex],
      body: {
        ...(d3ValueArray[pageIndex]?.['body'] || {}),
        [item?.id]: item,
      },
    };
  });

  return d3ValueArray;
};

export const generateLineFomDomPosition = (position: any) => {
  d3.select('#cv-header')
    .append('path')
    .attr('fill', lineColor)
    .attr(
      'd',
      `M${position.x},${position.height + position.y}v-.9H${
        position.x + position.width
      }v.9Z`,
    );
};

const calculateGroupLineCount = (text: string, maxLineSize: number) => {
  let lines: any[] = [],
    line: any[] = [];

  text.split(',').forEach(function (groupText) {
    line.push(groupText);
    const textForm = line.join(',');

    if (textForm.length > maxLineSize) {
      line.pop();
      lines.push(line.join(','));
      line = [groupText];
    }
  });

  lines.push(line.join(','));

  return lines;
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
          return e.position.y + 16 + lineHeight * lineNo;
        })
        .attr('x', (e: any) => {
          return e.position.x + 5;
        })
        .text(element)
        .call(wrap, width - 10);
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
      lineHeight = 1.6, // ems
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

export const setAreaText = (
  svgNode: Element,
  id: string,
  text: string,
  textAlign = 'lt',
  fillColor?: string | undefined | null,
) => {
  const g: any = svgNode.querySelector(`g[id="${id}"]`);
  let textElement: any = [];
  const rect = g.children[0].getBBox();
  const fs = 1 * g.children[1].getAttribute('font-size');
  const lh = 1.25 * fs;
  const bl = 0.8;
  let lastCord = 0;
  if (text && Array.isArray(text)) {
    //last item
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // let lineHeight = rect.y;
    // text[0] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    // text[0] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    text.map((item, i, row) => {
      let text = document.createElementNS(SVG_NS, 'text');
      if (i > 0) {
        const previousTxt = textElement[i - 1];
        const previousBoxHeight = previousTxt.getBBox().height;
        const heightWithPrev = previousBoxHeight + 5;
        // text.setAttributeNS(null, 'x', rect.x);
        // text.setAttributeNS(null, 'y', rect.y);
        text.setAttributeNS(
          null,
          'transform',
          `translate(18 ${heightWithPrev})`,
        );
        text.setAttributeNS(null, 'font-size', `${fs}`);
        fillColor && text.setAttribute('fill', fillColor);
        g.appendChild(text);
        rect.y += heightWithPrev;
        if (i == row.length - 1) {
          lastCord = rect.y;
        }
      }

      let currentChildren = g.children[i + 1];
      currentChildren.innerHTML = `${i + 1}. ${item}`;

      areaText(currentChildren, rect, {fs, lh, bl, ta: textAlign});
      textElement.push(currentChildren);
    });
  } else {
    if (text) g.children[1].innerHTML = text;
    areaText(g.children[1], rect, {fs, lh, bl, ta: textAlign});
    textElement.push(g.children[1]);
  }
  // g.children[0].setAttribute('fill', 'transparent');
  const lastElem = text ? textElement[text.length - 1] : textElement[0];
  return {
    textElement,
    lastElement: lastElem,
    lastCord,
  };
};
