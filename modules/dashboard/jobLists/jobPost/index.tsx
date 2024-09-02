import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import {Paper, Step, StepLabel, Stepper} from '@mui/material';
import {styled} from '@mui/material/styles';
import PrimaryJobInformation from './steps/PrimaryJobInformation';
import MoreJobInformation from './steps/MoreJobInformation';
import CandidateRequirements from './steps/CandidateRequirements';
import MatchingCriteria from './steps/MatchingCriteria';
import PreviewJob from './steps/PreviewJob';
import CompleteJobPost from './steps/CompleteJobPost';
import {adminDomain} from '../../../../@core/common/constants';
import {LINK_JOB_CREATE_OR_UPDATE} from '../../../../@core/common/appLinks';

const StyledPaper = styled(Paper)(({theme}) => ({
  padding: 15,
  '& .MuiStepLabel-iconContainer .Mui-active': {
    fontSize: '2.3rem',
    marginTop: '-7px',
    transition: 'all 100ms ease 100ms',
  },
  '& .Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
    borderTopWidth: '2px',
  },
  '& .MuiStepIcon-text': {
    fontSize: '1rem',
  },
}));

interface StepObj {
  id: number;
  langKey: string;
}

const steps: Array<StepObj> = [
  {
    id: 1,
    langKey: 'job_posting.primary_job_info',
  },
  {
    id: 2,
    langKey: 'job_posting.more_job_info',
  },
  {
    id: 3,
    langKey: 'job_posting.candidate_requirement',
  },
  // {
  //   id: 4,
  //   langKey: 'job_posting.company_info_visibility',
  // },
  {
    id: 4,
    langKey: 'job_posting.matching_criteria',
  },
  // {
  //   id: 6,
  //   langKey: 'job_posting.contract_info',
  // },
  {
    id: 5,
    langKey: 'job_posting.preview',
  },
  /*{
    id: 8,
    langKey: 'job_posting.complete',
  },*/
];

const stepNames: Array<string> = ['step1', 'step2', 'step3', 'step4', 'step5'];

const JobPostingView = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const {postStep, jobId} = router.query;
  const [jobIdState] = useState<string | null>(jobId ? String(jobId) : null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [clickedStep, setClickedStep] = useState<number | null>(null);
  const [lastestStep, setLastestStep] = useState<any>(1);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (postStep && jobId && stepNames.includes(postStep.toString())) {
      const step = postStep.toString();
      const regex = new RegExp('step(.*)');
      const match = step.match(regex);
      if (match) setActiveStep(Number(match[1]));
    } else if (postStep) {
      setIsValid(false);
    }
  }, [postStep, jobId]);

  const handleNext = () => {
    gotoStep(activeStep + 1);
    setClickedStep(null);
  };

  const handleBack = () => {
    gotoStep(activeStep - 1);
    setClickedStep(activeStep - 1);
  };

  const gotoStep = (step: number) => {
    router
      .push({
        pathname: LINK_JOB_CREATE_OR_UPDATE + 'step' + step,
        query: {
          jobId: jobId,
        },
      })
      .then(() => {});
  };

  const gotoActiveStep = (step: number) => {
    setClickedStep(step);
    router
      .push({
        pathname: LINK_JOB_CREATE_OR_UPDATE + 'step' + step,
        query: {
          jobId: jobId,
        },
      })
      .then(() => {});
  };

  const setLatestStep = (step: number) => {
    if (clickedStep) {
      gotoStep(clickedStep);
    } else if (activeStep > step) {
      gotoStep(step);
    }

    if (step) {
      setLastestStep(step);
    }
  };

  const getCurrentStepForm = useCallback(() => {
    if (jobIdState) {
      switch (activeStep) {
        case 1:
          return (
            <PrimaryJobInformation
              jobId={jobIdState}
              onContinue={handleNext}
              setLatestStep={setLatestStep}
            />
          );
        case 2:
          return (
            <MoreJobInformation
              jobId={jobIdState}
              onBack={handleBack}
              onContinue={handleNext}
              setLatestStep={setLatestStep}
            />
          );
        case 3:
          return (
            <CandidateRequirements
              jobId={jobIdState}
              onBack={handleBack}
              onContinue={handleNext}
              setLatestStep={setLatestStep}
            />
          );
        // case 4:
        //   return (
        //     <CompanyInfoVisibility
        //       jobId={jobIdState}
        //       onBack={handleBack}
        //       onContinue={handleNext}
        //       setLatestStep={setLatestStep}
        //     />
        //   );
        case 4:
          return (
            <MatchingCriteria
              jobId={jobIdState}
              onBack={handleBack}
              onContinue={handleNext}
              gotoStep={gotoActiveStep}
              setLatestStep={setLatestStep}
            />
          );
        // case 6:
        //   return (
        //     <ContactInformation
        //       jobId={jobIdState}
        //       onBack={handleBack}
        //       onContinue={handleNext}
        //       setLatestStep={setLatestStep}
        //     />
        //   );
        case 5:
          return (
            <PreviewJob
              jobId={jobIdState}
              onBack={handleBack}
              onContinue={handleNext}
              setLatestStep={setLatestStep}
            />
          );
        case 8:
          return (
            <CompleteJobPost
              jobId={jobIdState}
              onBack={handleBack}
              onContinue={handleNext}
              setLatestStep={setLatestStep}
            />
          );
        default:
          return <></>;
      }
    } else {
      return <></>;
    }
  }, [activeStep]);

  const onStepIconClick = (step: number) => {
    setClickedStep(step);
    setActiveStep(step);
    gotoStep(step);
    /*if (step <= lastestStep) {
      gotoStep(step);
    }*/
  };

  if (!isValid) {
    router
      .push({
        pathname: adminDomain(),
      })
      .then(() => {});
  }

  return isValid ? (
    <StyledPaper>
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {steps.map((step: StepObj) => {
          const stepProps: {completed?: boolean} = {
            completed: step.id < lastestStep,
          };

          const labelProps: {
            optional?: React.ReactNode;
            StepIconProps?: any;
          } = {
            StepIconProps: {
              sx: {
                cursor: 'pointer',
              },
              onClick: () => {
                onStepIconClick(step.id);
              },
            },
          };

          return (
            <Step key={'key' + step.id} {...stepProps}>
              <StepLabel {...labelProps}>{messages[step.langKey]}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>{getCurrentStepForm()}</React.Fragment>
    </StyledPaper>
  ) : (
    <></>
  );
};

export default JobPostingView;
