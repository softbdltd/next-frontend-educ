import * as d3 from 'd3';
import moment from 'moment';
import LocaleLanguage from '../utilities/LocaleLanguage';
import {ResultCodeAppeared} from '../../modules/learner/profile/utilities/EducationEnums';

interface IPosition {
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

interface IRenderSVG extends IcvPosition, ITextDesign {}

// const LanguageProficiencyType: any = {
//     '1': 'Easily',
//     '2': 'Not Easily',
// };

const textColor: string = '#231f20';
const lineColor: string = textColor;

export const getProps = (propsName: string, locale: string): string => {
  return locale === LocaleLanguage.BN ? propsName : propsName + '_en';
};

const getCVData = (data: any, messages: any, options: IcvPosition) => {
  // const textPadding: number = 10;
  // const bottomPadding: number = 15;
  const additionalSpace: number = 40;

  const rect = {
    width: options.rectDefaultWidth,
    height: options.rectDefaultHeight,
    x: options.startPositionX,
    y: options.startPositionY,
  };

  let learnerBio = data[getProps('bio', options.locale)] ?? '';

  let certificatesArray: any = [];
  let certificateLineCount = 0;

  let certificateSerial = 1;
  (data?.learner_certifications || []).map((e: any) => {
    if (e.certificate_issued_id == null) {
      let duration = '';
      if (e.start_date && e.end_date) {
        duration += `${messages['common.start_date']}: ${moment(
          e.start_date,
        ).format('DD-MM-YYYY')}, ${messages['common.end_date']}: ${moment(
          e.end_date,
        ).format('DD-MM-YYYY')}`;
      } else if (e.start_date && !e.end_date) {
        duration += `${messages['common.start_date']}: ${moment(
          e.start_date,
        ).format('DD-MM-YYYY')}`;
      } else if (!e.start_date && e.end_date) {
        duration += `${messages['common.end_date']}: ${moment(
          e.end_date,
        ).format('DD-MM-YYYY')}`;
      }

      const certificateFirstLine = `${certificateSerial++}. ${
        messages['certificate.certificate_title']
      }: ${e[getProps('certification_name', options.locale)]},${
        messages['common.location']
      }:${e[getProps('location', options.locale)]}, ${duration}`;

      let lines = Math.ceil(certificateFirstLine.length / options.maxLineSize);
      certificateLineCount += lines;

      const certificateSecondLine = `${messages['common.certificate']}: ${process.env.NEXT_PUBLIC_FILE_SERVER_FILE_VIEW_ENDPOINT}${e.certificate_file_path}`;
      certificateLineCount += 1;

      certificatesArray.push(certificateFirstLine);
      certificatesArray.push(certificateSecondLine);
    }
  });

  const d3Value = [
    {
      id: 'Objective',
      headline: messages['common.objective'],
      height: (learnerBio.length / options.maxLineSize) * 15 + additionalSpace,
      body: learnerBio,
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'JobExperience',
      headline: messages['common.job_experience'],
      height:
        (data?.learner_job_experiences?.length || 2) * options.lineHeight +
        additionalSpace,
      body: (data?.learner_job_experiences || []).map((e: any, i: number) => {
        let duration = '';
        if (e.is_currently_working) {
          duration += messages['common.present'];
        } else {
          duration += `${messages['common.start_date']}: ${moment(
            e.start_date,
          ).format('DD-MM-YYYY')}, ${messages['common.end_date']}: ${moment(
            e.end_date,
          ).format('DD-MM-YYYY')}`;
        }
        return `${i + 1}. ${messages['common.company_name']}: ${
          e[getProps('company_name', options.locale)]
        }, ${messages['common.designation']}: ${
          e[getProps('position', options.locale)]
        },${duration}`;
      }),
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'Education',
      headline: messages['education.label'],
      height:
        (data?.learner_educations?.length || 2) * options.lineHeight +
        additionalSpace,
      body: (data?.learner_educations || []).map((e: any, i: number) => {
        let resultTxt = `${messages['education.result']}: `;
        if (e.cgpa) {
          resultTxt += ` ${e.cgpa}`;
        } else {
          resultTxt += ` ${e.result?.title}`;
        }
        return `${i + 1}. ${messages['common.institute_name']}: ${
          e[getProps('institute_name', options.locale)]
        }, ${messages['education.duration']}:${
          e.duration || ''
        }, ${resultTxt}, ${
          e.result?.code != ResultCodeAppeared
            ? messages['education.passing_year']
            : messages['education.expected_passing_year']
        }: ${
          e.result?.code != ResultCodeAppeared
            ? e.year_of_passing
            : e.expected_year_of_passing
        }`;
      }),
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'Skills',
      headline: messages['skill.label'],
      height:
        (data?.skills?.length || 2) * options.lineHeight + additionalSpace,
      body: (data?.skills || []).map((e: any, i: number) => {
        return `${i + 1}. ${e[getProps('title', options.locale)]}`;
      }),
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'LanguagesProficiencies',
      headline: messages['language_proficiency.title'],
      height:
        (data?.learner_languages_proficiencies?.length || 2) *
          options.lineHeight +
        additionalSpace,
      body: (data?.learner_languages_proficiencies || []).map((e: any) => {
        return `${messages['language.label']}: ${
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
      }),
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'Certifications',
      headline: messages['common.certificate'],
      height:
        (certificateLineCount || 2) * options.lineHeight + additionalSpace,
      body: certificatesArray,
      position: {x: rect.x, y: rect.y},
    },
    {
      id: 'References',
      headline: messages['references.label'],
      height:
        (data?.learner_references?.length || 2) * options.lineHeight +
        additionalSpace,
      body: (data?.learner_references || []).map((e: any, i: number) => {
        return `${i + 1}. ${messages['learner.fullName']}: ${
          e[getProps('referrer_first_name', options.locale)]
        } ${e[getProps('referrer_last_name', options.locale)]}, ${
          messages['common.email']
        }: ${e[getProps('referrer_email', options.locale)]}, ${
          messages['common.phone']
        }: ${e[getProps('referrer_mobile', options.locale)]}, ${
          messages['common.organization_name']
        }: ${e[getProps('referrer_organization_name', options.locale)]}`;
      }),
      position: {x: rect.x, y: rect.y},
    },
  ];

  const objective = d3Value.filter((item) => item.id == 'Objective')[0];
  const experience = d3Value.filter((item) => item.id == 'JobExperience')[0];
  const education = d3Value.filter((item) => item.id == 'Education')[0];
  const skills = d3Value.filter((item) => item.id == 'Skills')[0] as Id3Value;
  const languages_proficiencies = d3Value.filter(
    (item) => item.id == 'LanguagesProficiencies',
  )[0] as Id3Value;
  const certifications = d3Value.filter(
    (item) => item.id == 'Certifications',
  )[0];
  const references = d3Value.filter((item) => item.id == 'References')[0];

  experience.position.y =
    objective.position.y +
    (objective?.height ?? options.rectDefaultHeight) +
    options.lineHeight;

  education.position.y =
    experience.position.y + (experience?.height ?? options.rectDefaultHeight);

  skills.position.y =
    education.position.y + (education?.height ?? options.rectDefaultHeight);

  languages_proficiencies.position.y =
    skills.position.y + (skills?.height ?? options.rectDefaultHeight);

  certifications.position.y =
    languages_proficiencies.position.y +
    (languages_proficiencies?.height ?? options.rectDefaultHeight);

  references.position.y =
    certifications.position.y +
    (certifications?.height ?? options.rectDefaultHeight);

  return d3Value;
};

const renderSVG = (data: any, options: IRenderSVG) => {
  const dthree = d3.select('g[id="cv-body"]');
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
  allSections
    .append('line')
    .attr('x1', (e: any) => {
      // console.log('line pos', e)
      return e.position.x;
    })
    .attr('y1', (e: any) => {
      return e.position.y + lineBottomSpace;
    })
    .attr('x2', (e: any) => {
      return options.rectDefaultWidth;
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

export const getStructureData = (data: any, messages: any, locale: any) => {
  const startPositionX: number = 18;
  const startPositionY: number = 220;
  const rectDefaultWidth: number = 560;
  const rectDefaultHeight: number = 100;
  const headerHeight: number = 20;
  const bodyFontSize: number = 11;
  const headlineSize: number = bodyFontSize + 3;
  const lineHeight = 18;
  const maxLineSize = 110;

  const cvDataOptions = {
    headerHeight: headerHeight,
    rectDefaultHeight: rectDefaultHeight,
    rectDefaultWidth: rectDefaultWidth,
    startPositionX: startPositionX,
    startPositionY: startPositionY,
    lineHeight: lineHeight,
    maxLineSize: maxLineSize,
    locale: locale,
  };

  const d3Value = getCVData(data, messages, cvDataOptions);

  renderSVG(d3Value, {
    ...cvDataOptions,
    ...{
      bodyFontSize: bodyFontSize,
      headlineSize: headlineSize,
    },
  });
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
      let l = Math.ceil(element.length / maxLineSize);
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
    var text = d3.select(this),
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
