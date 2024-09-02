import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {Body1, Body2, H3, S1, S2} from '../../../../../@core/elements/common';
import JobPreviewSubComponent from './components/JobPreviewSubComponent';
import {styled} from '@mui/material/styles';
import {
  EmploymentStatus,
  Gender,
  SalaryShowOption,
  SalaryTypes,
  WorkPlaceTypes,
} from '../enums/JobPostEnums';
import IntlMessages from '../../../../../@core/utility/IntlMessages';
import {useFetchJobPreview} from '../../../../../services/IndustryManagement/hooks';
import {LINK_JOB_LIST} from '../../../../../@core/common/appLinks';
import {useRouter} from 'next/router';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const PREFIX = 'JobPreview';

const classes = {
  footerTitle: `${PREFIX}-footerTitle`,
  otherBenefit: `${PREFIX}-otherBenefit`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.footerTitle}`]: {
    display: 'inline-block',
    paddingBottom: '10px',
    borderBottom: '2px solid #d5d5d5',
  },
  [`& .${classes.otherBenefit}`]: {
    display: 'inline-block',
    textAlign: 'center',
    marginTop: '20px',
    marginLeft: '40px',

    [`& .MuiSvgIcon-root`]: {
      display: 'block',
      margin: 'auto',
      color: theme.palette.primary.light,
    },
  },
  [`& ul>li`]: {
    marginTop: '5px',
  },
}));

const PreviewJob = ({jobId, onBack, onContinue, setLatestStep}: Props) => {
  const {messages, formatNumber, formatDate} = useIntl();
  const {data: jobData} = useFetchJobPreview(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);
  const router = useRouter();
  const {successStack} = useNotiStack();

  useEffect(() => {
    if (jobData && jobData?.latest_step) {
      const latestStep = jobData?.latest_step;
      delete jobData?.latest_step;

      if (latestStep >= 5) {
        setIsReady(true);
      }
      setLatestStep(latestStep);
    }
  }, [jobData]);

  const getJobNature = () => {
    let jobNature: Array<string> = [];
    if (jobData?.primary_job_information?.employment_types) {
      jobData?.primary_job_information?.employment_types.map((types: any) => {
        switch (types.id) {
          case EmploymentStatus.FULL_TIME:
            jobNature.push(
              messages['job_posting.employment_status_full_time'] as string,
            );
            break;
          case EmploymentStatus.PART_TIME:
            jobNature.push(
              messages['job_posting.employment_status_part_time'] as string,
            );
            break;
          case EmploymentStatus.APPRENTICESHIP:
            jobNature.push(
              messages[
                'job_posting.employment_status_apprenticeship'
              ] as string,
            );
            break;
          case EmploymentStatus.CONTRACTUAL:
            jobNature.push(
              messages['job_posting.employment_status_contractual'] as string,
            );
            break;
        }
      });
    }
    return jobNature.join(', ');
  };

  const getSalaryType = (type: number) => {
    switch (Number(type)) {
      case SalaryTypes.DAILY:
        return messages['job.salary_type_daily'];
      case SalaryTypes.WEEKLY:
        return messages['job.salary_type_weekly'];
      case SalaryTypes.MONTHLY:
        return messages['job.salary_type_monthly'];
      case SalaryTypes.ANNUAL:
        return messages['job.salary_type_annual'];
      default:
        return messages['job.salary_type_monthly'];
    }
  };

  const getSalary = () => {
    let salaryText: any = '';

    if (
      jobData?.additional_job_information?.is_salary_info_show ==
      SalaryShowOption.YES
    ) {
      salaryText =
        '৳ ' +
        formatNumber(jobData?.additional_job_information?.salary_min) +
        ' - ' +
        formatNumber(jobData?.additional_job_information?.salary_max) +
        ` (${getSalaryType(jobData?.additional_job_information?.salary_type)})`;
    } else if (
      jobData?.additional_job_information?.is_salary_info_show ==
      SalaryShowOption.NEGOTIABLE
    ) {
      salaryText = messages['common.negotiable'];
    }

    return salaryText;
  };

  const getExperienceText = () => {
    if (jobData?.candidate_requirements?.is_experience_needed == 1) {
      let experienceText: any = '';
      if (
        jobData?.candidate_requirements?.minimum_year_of_experience &&
        jobData?.candidate_requirements?.maximum_year_of_experience
      ) {
        experienceText = (
          <IntlMessages
            id={'job_preview.experience_from_to'}
            values={{
              from: formatNumber(
                jobData?.candidate_requirements?.minimum_year_of_experience,
              ),
              to: formatNumber(
                jobData?.candidate_requirements?.maximum_year_of_experience,
              ),
            }}
          />
        );
      } else if (jobData?.candidate_requirements?.minimum_year_of_experience) {
        experienceText = (
          <IntlMessages
            id={'job_preview.experience_at_least'}
            values={{
              from: formatNumber(
                jobData?.candidate_requirements?.minimum_year_of_experience,
              ),
            }}
          />
        );
      } else if (jobData?.candidate_requirements?.maximum_year_of_experience) {
        experienceText = (
          <IntlMessages
            id={'job_preview.experience_at_most'}
            values={{
              from: formatNumber(
                jobData?.candidate_requirements?.maximum_year_of_experience,
              ),
            }}
          />
        );
      }
      return experienceText;
    } else {
      return messages['common.n_a'];
    }
  };

  const getAgeText = () => {
    let ageText: any = '';

    if (
      jobData?.candidate_requirements?.age_minimum &&
      jobData?.candidate_requirements?.age_maximum
    ) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_from_to'}
          values={{
            from: formatNumber(jobData?.candidate_requirements?.age_minimum),
            to: formatNumber(jobData?.candidate_requirements?.age_maximum),
          }}
        />
      );
    } else if (jobData?.candidate_requirements?.age_minimum) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_at_least'}
          values={{
            from: formatNumber(jobData?.candidate_requirements?.age_minimum),
          }}
        />
      );
    } else if (jobData?.candidate_requirements?.age_maximum) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_at_most'}
          values={{
            from: formatNumber(jobData?.candidate_requirements?.age_minimum),
          }}
        />
      );
    }

    return ageText;
  };

  const getJobContext = () => {
    let strArr: Array<string> = [];
    strArr = jobData?.additional_job_information?.job_context.split('\n');
    if (strArr.length == 1) {
      return strArr[0];
    } else {
      return (
        <ul style={{paddingLeft: '20px'}}>
          {strArr.map((item: string, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  };

  const getResponsibilities = () => {
    let strArr: Array<string> = [];
    if (jobData?.additional_job_information?.job_responsibilities) {
      strArr =
        jobData?.additional_job_information?.job_responsibilities.split('\n');
    }
    if (strArr.length == 0) {
      return '';
    } else if (strArr.length == 1) {
      return strArr[0];
    } else {
      return (
        <ul style={{paddingLeft: '20px'}}>
          {strArr.map((item: string, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  };

  const getEducationalRequirements = () => {
    let isShowNotApplicable = true;
    let educationalInstitutes = '';

    if (jobData?.candidate_requirements?.preferred_educational_institutions) {
      educationalInstitutes =
        jobData?.candidate_requirements?.preferred_educational_institutions
          .map((ins: any) => ins.name)
          .join(', ');
    }

    let professionalCertificates = '';

    if (jobData?.candidate_requirements?.professional_certifications) {
      professionalCertificates =
        jobData?.candidate_requirements?.professional_certifications
          .map((cert: any) => cert.title)
          .join(', ');
    }

    let trainingOrTradeCourse = '';

    if (jobData?.candidate_requirements?.trainings) {
      trainingOrTradeCourse = jobData?.candidate_requirements?.trainings
        .map((course: any) => course.title)
        .join(', ');
    }

    let skillText = '';
    if (jobData?.candidate_requirements?.candidate_requirement_skills) {
      skillText = jobData?.candidate_requirements?.candidate_requirement_skills
        .map((skill: any) => skill.title)
        .join(', ');
    }

    if (
      jobData?.candidate_requirements?.degrees?.length > 0 ||
      educationalInstitutes ||
      professionalCertificates ||
      trainingOrTradeCourse ||
      skillText
    ) {
      isShowNotApplicable = false;
    }

    return (
      <ul style={{paddingLeft: '20px'}}>
        {jobData?.candidate_requirements?.degrees?.map(
          (degree: any, index: number) =>
            degree?.education_level ? (
              <li key={index}>
                {degree?.education_level?.title}
                {degree?.details ? ' in ' + degree?.details : ''}
              </li>
            ) : (
              <React.Fragment key={index} />
            ),
        )}
        {educationalInstitutes && (
          <li>
            {educationalInstitutes}{' '}
            {messages['job_preview.prefer_institute_text']}
          </li>
        )}
        {professionalCertificates && (
          <li>
            {messages['job_preview.professional_cert']}{' '}
            {professionalCertificates}
          </li>
        )}
        {trainingOrTradeCourse && (
          <li>
            {messages['job_preview.training_or_trade']} {trainingOrTradeCourse}
          </li>
        )}
        {skillText && (
          <li>
            {messages['job_preview.skill_required']} {skillText}
          </li>
        )}
        {isShowNotApplicable && <li>{messages['common.n_a']}</li>}
      </ul>
    );
  };

  const getExperienceRequirements = () => {
    if (jobData?.candidate_requirements?.is_experience_needed == 1) {
      let experienceText = getExperienceText();

      let experienceAreas = '';
      if (
        jobData?.candidate_requirements
          ?.candidate_requirement_area_of_experiences
      ) {
        experienceAreas =
          jobData?.candidate_requirements?.candidate_requirement_area_of_experiences
            ?.map((experience: any) => experience.title)
            .join(', ');
      }

      let experienceBusinessAreas = '';
      if (jobData?.candidate_requirements?.area_of_businesses) {
        experienceBusinessAreas =
          jobData?.candidate_requirements?.area_of_businesses
            ?.map((business: any) => business.title)
            .join(', ');
      }

      let isShowNotApplicable = true;
      if (
        experienceText ||
        jobData?.candidate_requirements?.is_freshers_encouraged == 1 ||
        experienceAreas ||
        experienceBusinessAreas
      ) {
        isShowNotApplicable = false;
      }

      return (
        <ul style={{paddingLeft: '20px'}}>
          <li>{experienceText}</li>
          {jobData?.candidate_requirements?.is_freshers_encouraged == 1 && (
            <li>{messages['job_post.is_fresher_applicable']}</li>
          )}
          {experienceAreas && (
            <li>
              {messages['job_preview.experience_area_label']}
              <ul style={{listStyleType: 'square'}}>
                <li>{experienceAreas}</li>
              </ul>
            </li>
          )}
          {experienceBusinessAreas && (
            <li>
              {messages['job_preview.business_area_label']}
              <ul style={{listStyleType: 'square'}}>
                <li>{experienceBusinessAreas}</li>
              </ul>
            </li>
          )}
          {isShowNotApplicable && <li>{messages['common.n_a']}</li>}
        </ul>
      );
    } else {
      return messages['common.n_a'];
    }
  };

  const getGenderText = () => {
    let male = false;
    let female = false;
    let other = false;
    jobData?.candidate_requirements?.genders.map((gender: any) => {
      switch (gender.gender_id) {
        case Gender.MALE:
          male = true;
          break;
        case Gender.FEMALE:
          female = true;
          break;
        case Gender.OTHERS:
          other = true;
          break;
      }
    });

    if (male && female && other) {
      return messages['job_posting.application_gender_req_all'];
    } else if (male && female) {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_two'}
          values={{
            gender1: messages['common.male'],
            gender2: messages['common.female'],
          }}
        />
      );
    } else if (male && other) {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_two'}
          values={{
            gender1: messages['common.male'],
            gender2: messages['common.others'],
          }}
        />
      );
    } else if (female && other) {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_two'}
          values={{
            gender1: messages['common.female'],
            gender2: messages['common.others'],
          }}
        />
      );
    } else if (male) {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_one'}
          values={{
            gender: messages['common.male'],
          }}
        />
      );
    } else if (female) {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_one'}
          values={{
            gender: messages['common.female'],
          }}
        />
      );
    } else {
      return (
        <IntlMessages
          id={'job_posting.application_gender_req_one'}
          values={{
            gender: messages['common.others'],
          }}
        />
      );
    }
  };

  const getAdditionalRequirements = () => {
    let strArr: Array<string> = [];
    if (jobData?.candidate_requirements?.additional_requirements) {
      strArr =
        jobData?.candidate_requirements?.additional_requirements.split('\n');
    }

    let isShowNotApplicable = true;
    if (
      getAgeText() ||
      strArr.length > 0 ||
      jobData?.candidate_requirements?.genders.length > 0 ||
      jobData?.candidate_requirements?.person_with_disability == 1
    ) {
      isShowNotApplicable = false;
    }

    return (
      <ul style={{paddingLeft: '20px'}}>
        {getAgeText() && (
          <li>
            {' '}
            {messages['job_preview_summary.age']} {getAgeText()}
          </li>
        )}
        {jobData?.candidate_requirements?.genders.length > 0 &&
          jobData?.candidate_requirements?.genders.length <= 3 && (
            <li>{getGenderText()}</li>
          )}
        {strArr.map((item: string, index) => (
          <li key={index}>{item}</li>
        ))}
        {jobData?.candidate_requirements?.person_with_disability == 1 && (
          <li>{messages['job_preview.person_with_disability']}</li>
        )}
        {isShowNotApplicable && <li>{messages['common.n_a']}</li>}
      </ul>
    );
  };

  const getWorkplace = () => {
    let workplaceStrArr: Array<string> = [];

    jobData?.additional_job_information?.work_places.map((workplace: any) => {
      if (workplace.work_place_id == WorkPlaceTypes.HOME) {
        workplaceStrArr.push(messages['common.work_from_home'] as string);
      } else if (workplace.work_place_id == WorkPlaceTypes.OFFICE) {
        workplaceStrArr.push(messages['common.work_at_office'] as string);
      }
    });

    return (
      <ul style={{paddingLeft: '20px'}}>
        <li>{workplaceStrArr.join(', ')}</li>
      </ul>
    );
  };

  const otherBenefitComponent = (index: number, id: string, name: string) => {
    return (
      <Box key={index} className={classes.otherBenefit}>
        <img
          src={'/images/jobs/benefit_' + id + '.svg'}
          alt={name}
          style={{display: 'block', margin: 'auto'}}
        />
        {name}
      </Box>
    );
  };

  const getOtherBenefits = () => {
    if (jobData?.additional_job_information?.is_other_benefits == 1) {
      /*let salaryReviewText = null;
      if (jobData?.additional_job_information?.salary_review) {
        salaryReviewText =
          (messages['job_preview.salary_review'] as string) +
          (jobData?.additional_job_information?.salary_review ==
          SalaryReviewType.YEARLY
            ? messages['common.yearly']
            : messages['common.half_yearly']);
      }
      let lunchFacilitiesText = null;
      if (jobData?.additional_job_information?.lunch_facilities) {
        lunchFacilitiesText =
          (messages['job_preview.lunch_facilities'] as string) +
          (jobData?.additional_job_information?.lunch_facilities ==
          LunchFacilityType.FULL_SUBSIDIZE
            ? messages['common.full_subsidize']
            : messages['common.partially_subsidize']);
      }*/

      let othersArr: Array<string> = [];
      if (jobData?.additional_job_information?.others) {
        othersArr = jobData?.additional_job_information?.others.split('\n');
      }

      return (
        <React.Fragment>
          <ul style={{paddingLeft: '20px'}}>
            {jobData?.additional_job_information?.festival_bonus && (
              <li>
                {messages['job_preview.festival_bonus']}{' '}
                {formatNumber(
                  jobData?.additional_job_information?.festival_bonus,
                )}
                ({messages['common.yearly']})
              </li>
            )}
          </ul>
          <Box
            sx={{
              marginTop: '-15px',
              marginLeft: '-30px',
            }}>
            {(jobData?.additional_job_information?.other_benefits || []).map(
              (otherBenefit: any, index: number) => {
                return otherBenefitComponent(
                  index,
                  otherBenefit?.id,
                  otherBenefit?.title,
                );
              },
            )}
          </Box>
          <ul style={{paddingLeft: '20px'}}>
            {othersArr.map((other: string, index) => (
              <li key={index}>{other}</li>
            ))}
          </ul>
        </React.Fragment>
      );
    } else {
      return messages['common.n_a'];
    }
  };

  const getCompanyName = () => {
    if (jobData?.primary_job_information?.is_job_post_for_other == 1) {
      return jobData?.primary_job_information?.other_name;
    } else {
      if (jobData?.primary_job_information?.industry_association_id) {
        if (jobData?.primary_job_information?.organization_id) {
          return jobData?.primary_job_information?.organization_title;
        } else {
          return jobData?.primary_job_information?.industry_association_title;
        }
      } else if (jobData?.primary_job_information?.organization_id) {
        return jobData?.primary_job_information?.organization_title;
      } else {
        return '';
      }
    }
  };

  const getCompanyAddress = () => {
    let address: string = '';

    if (jobData?.primary_job_information?.is_job_post_for_other == 1) {
      address = jobData?.primary_job_information?.other_address;
    } else {
      if (jobData?.primary_job_information?.industry_association_id) {
        if (jobData?.primary_job_information?.organization_id) {
          address = jobData?.primary_job_information?.organization_address;
        } else {
          address =
            jobData?.primary_job_information?.industry_association_address;
        }
      } else if (jobData?.primary_job_information?.organization_id) {
        address = jobData?.primary_job_information?.organization_address;
      }
    }

    return (
      <React.Fragment>
        <Body2>
          {messages['address.label']}: {address}
        </Body2>
      </React.Fragment>
    );
  };
  const getCompanyEmail = () => {
    let email: string = '';
    let mobile: string = '';

    if (jobData?.primary_job_information?.is_job_post_for_other == 1) {
      email = jobData?.primary_job_information?.other_email;
      mobile = jobData?.primary_job_information?.other_mobile;
    } else {
      if (jobData?.primary_job_information?.industry_association_id) {
        if (jobData?.primary_job_information?.organization_id) {
          email = jobData?.primary_job_information?.organization_email;
        } else {
          email = jobData?.primary_job_information?.industry_association_email;
        }
      } else if (jobData?.primary_job_information?.organization_id) {
        email = jobData?.primary_job_information?.organization_email;
      }
    }
    return (
      <React.Fragment>
        {mobile && (
          <Body2>
            {messages['common.mobile']}: {mobile}
          </Body2>
        )}
        {email && (
          <Body2>
            {messages['common.email']}: {email}
          </Body2>
        )}
      </React.Fragment>
    );
  };

  const getLocations = () => {
    if (jobData?.additional_job_information?.job_place_type == 1) {
      return messages['job.location_anywhere_in_bd'];
    } else {
      let homeOffice = (
        jobData?.additional_job_information?.work_places || []
      ).find((item: any) => item.work_place_id == WorkPlaceTypes.HOME);

      if (homeOffice) {
        return messages['common.work_from_home'];
      } else {
        return jobData?.additional_job_information?.job_locations
          ?.map((location: any) => location.title)
          .join(', ');
      }
    }
  };

  return isReady ? (
    <StyledBox mt={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <H3>{jobData?.primary_job_information?.job_title}</H3>
          <S1 fontWeight={'bold'}>{getCompanyName()}</S1>
          <JobPreviewSubComponent title={messages['common.vacancy']}>
            {jobData?.primary_job_information?.no_of_vacancies
              ? formatNumber(jobData?.primary_job_information?.no_of_vacancies)
              : messages['common.n_a']}
          </JobPreviewSubComponent>

          {jobData?.additional_job_information?.job_context && (
            <JobPreviewSubComponent title={messages['job_posting.job_context']}>
              {getJobContext()}
            </JobPreviewSubComponent>
          )}

          <JobPreviewSubComponent
            title={messages['job_posting.job_responsibility']}>
            {getResponsibilities()}
          </JobPreviewSubComponent>
          <JobPreviewSubComponent
            title={messages['job_posting.employment_status']}>
            {getJobNature()}
          </JobPreviewSubComponent>
          <JobPreviewSubComponent
            title={messages['job_posting.educational_requirements']}>
            {getEducationalRequirements()}
          </JobPreviewSubComponent>
          <JobPreviewSubComponent
            title={messages['job_posting.experience_requirements']}>
            {getExperienceRequirements()}
          </JobPreviewSubComponent>
          <JobPreviewSubComponent
            title={messages['job_posting.additional_requirements']}>
            {getAdditionalRequirements()}
          </JobPreviewSubComponent>
          {jobData?.additional_job_information?.work_places && (
            <JobPreviewSubComponent title={messages['job_posting.workplace']}>
              {getWorkplace()}
            </JobPreviewSubComponent>
          )}
          <JobPreviewSubComponent title={messages['common.job_location']}>
            {getLocations()}
          </JobPreviewSubComponent>
          <JobPreviewSubComponent title={messages['common.salary']}>
            <ul style={{paddingLeft: '20px'}}>
              <li>{getSalary()}</li>
            </ul>
          </JobPreviewSubComponent>
          <JobPreviewSubComponent
            title={messages['job_posting.compensation_and_other_benefits']}>
            {getOtherBenefits()}
          </JobPreviewSubComponent>

          <JobPreviewSubComponent title={messages['job_posting.job_source']}>
            {messages['job.online_job_posting']}
          </JobPreviewSubComponent>
          {jobData?.primary_job_information?.published_at && (
            <JobPreviewSubComponent
              title={messages['job_posting.published_on']}>
              {formatDate(jobData?.primary_job_information?.published_at, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </JobPreviewSubComponent>
          )}
        </Grid>
        <Grid item xs={1} md={4}>
          <Typography>
            <b>{messages['job_preview.job_sector_occupation']}</b>{' '}
            {jobData?.primary_job_information?.job_sector_title}/
            {jobData?.primary_job_information?.occupation_title}
          </Typography>
          <Card sx={{border: '1px solid #bbbbbb', marginTop: '10px'}}>
            <Box
              sx={{
                backgroundColor: 'common.black',
                padding: '10px',
                color: 'common.white',
              }}>
              {messages['job_preview.job_summary']}
            </Box>
            <CardContent>
              {jobData?.primary_job_information?.published_at && (
                <Body2>
                  <b>{messages['job_posting.published_on']}</b>{' '}
                  {formatDate(jobData?.primary_job_information?.published_at, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Body2>
              )}
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.vacancy']} </b>
                {jobData?.primary_job_information?.no_of_vacancies
                  ? formatNumber(
                      jobData?.primary_job_information?.no_of_vacancies,
                    )
                  : messages['common.n_a']}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.job_nature']} </b>
                {getJobNature()}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.age']} </b>
                {getAgeText() ? getAgeText() : messages['common.n_a']}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.experience']} </b>
                {getExperienceText()}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.job_location']} </b>
                {getLocations()}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.salary']} </b>
                {getSalary()}
              </Body2>
              <Body2 sx={{marginTop: '6px'}}>
                <b>{messages['job_preview_summary.application_deadline']} </b>
                {jobData?.primary_job_information?.application_deadline
                  ? formatDate(
                      jobData?.primary_job_information?.application_deadline,
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )
                  : ''}
              </Body2>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} textAlign={'center'} mt={2}>
          <S2 fontWeight={'bold'} className={classes.footerTitle}>
            {messages['job_preview.read_before_apply']}
          </S2>
          {jobData?.primary_job_information
            ?.special_instruction_for_job_seekers && (
            <Body2 mt={2} color={'grey.600'}>
              {
                jobData?.primary_job_information
                  ?.special_instruction_for_job_seekers
              }
            </Body2>
          )}
          {jobData?.primary_job_information
            ?.is_photograph_enclose_with_resume == 1 && (
            <S2 mt={1}>
              <IntlMessages
                id={'job_preview.photograph_enclose_with_resume'}
                values={{
                  photo: (
                    <span style={{color: 'red'}}>
                      *{messages['job_preview.photograph']}
                    </span>
                  ),
                }}
              />
            </S2>
          )}
          <Box>
            <Button
              color={'primary'}
              size={'medium'}
              variant={'contained'}
              sx={{marginTop: '15px'}}>
              {messages['common.apply_online']}
            </Button>
          </Box>

          {/*{jobData?.primary_job_information?.resume_receiving_option ==
            ResumeReceivingOptions.EMAIL && (
            <Box mt={3}>
              <S2>{messages['common.email']}</S2>
              <Body2 color={'grey.600'}>
                <IntlMessages
                  id={'job_preview.send_your_cv'}
                  values={{
                    email: (
                      <a
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                          fontWeight: 'bold',
                        }}
                        href={
                          'mailto:' + jobData?.primary_job_information?.email
                        }>
                        {jobData?.primary_job_information?.email}{' '}
                      </a>
                    ),
                  }}
                />
              </Body2>
            </Box>
          )}

          {jobData?.primary_job_information?.resume_receiving_option ==
            ResumeReceivingOptions.HARD_COPY && (
            <Box mt={3}>
              <S2 fontWeight={'bold'}>{messages['job_posting.hard_copy']}</S2>
              <Body2 color={'grey.600'} sx={{whiteSpace: 'break-spaces'}}>
                {jobData?.primary_job_information?.instruction_for_hard_copy}
              </Body2>
            </Box>
          )}

          {jobData?.primary_job_information?.resume_receiving_option ==
            ResumeReceivingOptions.WALK_IN_INTERVIEW && (
            <Box mt={3}>
              <S2 fontWeight={'bold'}>
                {messages['job_posting.walk_in_interview']}
              </S2>
              <Body2 color={'grey.600'} sx={{whiteSpace: 'break-spaces'}}>
                {
                  jobData?.primary_job_information
                    ?.instruction_for_walk_in_interview
                }
              </Body2>
            </Box>
          )}*/}

          <Body1 mt={2}>
            {messages['job_preview_summary.application_deadline']}{' '}
            {jobData?.primary_job_information?.application_deadline
              ? formatDate(
                  jobData?.primary_job_information?.application_deadline,
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  },
                )
              : ''}
          </Body1>
        </Grid>
        <Grid
          item
          xs={12}
          mt={4}
          sx={{
            borderTop: '1px solid #e9e9e9',
          }}>
          <S2 fontWeight={'bold'} mb={1}>
            {messages['job_preview.company_information']}
          </S2>
          <Box color={'grey.600'}>
            <Body2>
              {messages['common.name']}: {getCompanyName()}
            </Body2>
            {getCompanyAddress()}
            {getCompanyEmail()}
          </Box>
        </Grid>
      </Grid>
      <Box mt={3} display={'flex'} justifyContent={'space-between'}>
        <Button onClick={onBack} variant={'outlined'} color={'primary'}>
          {messages['common.previous']}
        </Button>
        <Button
          variant={'contained'}
          color={'primary'}
          size={'small'}
          onClick={() => {
            successStack(messages['job.posted_successfully']);
            router
              .push({
                pathname: LINK_JOB_LIST,
              })
              .then(() => {});
          }}>
          {messages['job_posting.end_process']}
        </Button>
      </Box>
    </StyledBox>
  ) : (
    <></>
  );
};

export default PreviewJob;
