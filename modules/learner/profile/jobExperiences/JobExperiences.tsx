import {useIntl} from 'react-intl';
import CustomParabolaButton from '../component/CustomParabolaButton';
import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import {AccessTime, BorderColor, Verified} from '@mui/icons-material';
import {Avatar, Box, Grid, Typography} from '@mui/material';
import {YouthJobExperience} from '../../../../services/learnerManagement/typing';
import TextPrimary from '../component/TextPrimary';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HorizontalLine from '../component/HorizontalLine';
import VerticalLine from '../component/VerticalLine';
import {getIntlDateFromString} from '../../../../@core/utilities/helpers';
import {styled} from '@mui/material/styles';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import {Body2, S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import CustomConfirmationButton from '../component/CustomConfirmationButton';
import CustomCheckboxWithoutForm from '../../../../@core/elements/input/CustomCheckboxWithoutForm';
import {learnerProfileShowInCV} from '../../../../services/learnerManagement/YouthService';
import {FiTrash2} from 'react-icons/fi';

const PREFIX = 'JobExperience';
const classes = {
  textStyle: `${PREFIX}-textStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
}));

type JobExperienceProp = {
  jobExperiences: Array<YouthJobExperience>;
  onOpenAddEditForm: (itemId: number) => void;
  onDeleteJobExperience: (itemId: number) => void;
  disabled: boolean;
};

const JobExperiences = ({
  jobExperiences,
  onOpenAddEditForm,
  onDeleteJobExperience,
  disabled,
}: JobExperienceProp) => {
  const {messages, formatDate} = useIntl();
  const result = useCustomStyle();
  const [showInCV, setShowInCV] = useState<any>(() => {
    const defaultValue: any = {};
    jobExperiences?.forEach((item: any) => {
      defaultValue[item?.id] = item?.show_in_cv;
    });
    return defaultValue;
  });

  useEffect(() => {
    const defaultValue: any = {};
    jobExperiences?.forEach((item: any) => {
      defaultValue[item?.id] = item?.show_in_cv;
    });
    setShowInCV(defaultValue);
  }, [jobExperiences]);

  const handleChangeForJobExperience = async (id: any) => {
    const showInCVValue = !showInCV[id];

    setShowInCV((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));

    //   api call

    try {
      await learnerProfileShowInCV({
        module: 'learner_job_experiences',
        module_id: id,
        show_in_cv: showInCVValue ? 1 : 0,
      });
    } catch (error: any) {}
  };

  const debounceFn = _.debounce(handleChangeForJobExperience, 500);

  return (
    <React.Fragment>
      {jobExperiences.map((jobExperience: any, index) => (
        <React.Fragment key={jobExperience.id}>
          <HorizontalLine />
          <StyledGrid container spacing={2}>
            <Grid item xs={12} sm={8} md={8}>
              <Box sx={{display: 'flex'}}>
                <Avatar>
                  <Verified />
                </Avatar>
                <Box sx={{marginLeft: '15px'}}>
                  <S1 sx={{...result.subtitle2}} className={classes.textStyle}>
                    {jobExperience?.company_name}
                  </S1>
                  <Body2>{jobExperience?.position}</Body2>
                </Box>
              </Box>
              <Box>
                <Grid container sx={{marginTop: '10px'}}>
                  <Grid item sx={{display: 'flex'}}>
                    <AccessTime color={'primary'} sx={{marginRight: '5px'}} />
                    <TextPrimary
                      text={
                        getIntlDateFromString(
                          formatDate,
                          jobExperience?.start_date,
                        ) +
                        ' - ' +
                        (jobExperience.is_currently_working == 1
                          ? messages['common.present']
                          : jobExperience?.end_date
                          ? getIntlDateFromString(
                              formatDate,
                              jobExperience?.end_date,
                            )
                          : '')
                      }
                    />
                  </Grid>
                  <VerticalLine />
                  <Grid item sx={{display: 'flex'}}>
                    <LocationOnIcon
                      color={'primary'}
                      sx={{marginRight: '5px'}}
                    />
                    <TextPrimary text={jobExperience?.location} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CustomParabolaButton
                  buttonVariant={'outlined'}
                  title={messages['common.edit_btn'] as string}
                  icon={<BorderColor />}
                  onClick={() => {
                    onOpenAddEditForm(jobExperience.id);
                  }}
                  disabled={disabled}
                />
                {disabled ? (
                  <span style={{paddingLeft: 5}}>
                    <CustomParabolaButton
                      buttonVariant={'outlined'}
                      title={messages['common.delete'] as string}
                      icon={<FiTrash2 />}
                      disabled={disabled}
                    />
                  </span>
                ) : (
                  <CustomConfirmationButton
                    confirmAction={async () => {
                      await onDeleteJobExperience(jobExperience.id);
                    }}
                    buttonType={'delete'}
                    dialogTitle={
                      messages['confirmation_text.job_experience'] as string
                    }
                    disabled={disabled}
                  />
                )}
              </Box>

              <Grid item xs={12} sx={{m: 1, ml: 3}}>
                <CustomCheckboxWithoutForm
                  id={`is_job_experience_${index}`}
                  label={messages['common.is_show_in_cv']}
                  checked={!!showInCV[jobExperience.id]}
                  onChange={() => debounceFn(jobExperience.id)}
                  isDisabled={disabled}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>{jobExperience?.job_responsibilities}</Typography>
            </Grid>
          </StyledGrid>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default JobExperiences;
