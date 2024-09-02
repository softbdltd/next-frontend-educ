import React, {FC, useEffect, useState} from 'react';
import {Avatar, Box, Grid, IconButton, Typography} from '@mui/material';
import {
  AccessTime,
  BorderColor,
  CheckCircle,
  Verified,
} from '@mui/icons-material';
import TextPrimary from '../component/TextPrimary';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {YouthEducation} from '../../../../services/learnerManagement/typing';
import {useIntl} from 'react-intl';
import HorizontalLine from '../component/HorizontalLine';
import VerticalLine from '../component/VerticalLine';
import {ResultCodeAppeared, ResultCodeGrade} from '../utilities/EducationEnums';
import {getIntlNumber} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {styled} from '@mui/material/styles';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import {Body2, Link, S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import CustomConfirmationButton from '../component/CustomConfirmationButton';
import {learnerProfileShowInCV} from '../../../../services/learnerManagement/YouthService';
import CustomCheckboxWithoutForm from '../../../../@core/elements/input/CustomCheckboxWithoutForm';
import * as _ from 'lodash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../../@core/common/apiRoutes';
import {FiTrash2} from 'react-icons/fi';

const PREFIX = 'Educations';
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

interface EducationsProps {
  educations: Array<YouthEducation> | any[];
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
  disabled: boolean;
}

const Educations: FC<EducationsProps> = ({
  educations,
  onEditClick,
  onDeleteClick,
  disabled,
}) => {
  const {messages, formatNumber} = useIntl();
  const result = useCustomStyle();

  const [showInCV, setShowInCV] = useState<any>({});

  useEffect(() => {
    const defaultValue: any = {};
    educations?.forEach((item: any) => {
      defaultValue[item?.id] = item?.show_in_cv;
    });
    setShowInCV(defaultValue);
  }, [educations]);

  const handleChangeForEducations = async (id: any) => {
    const showInCVValue = !showInCV[id];

    setShowInCV((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));

    //   api call
    try {
      await learnerProfileShowInCV({
        module: 'learner_educations',
        module_id: id,
        show_in_cv: showInCVValue ? 1 : 0,
      });
    } catch (error: any) {}
  };

  const debounceFn = _.debounce(handleChangeForEducations, 500);

  const getResult = (education: any) => {
    if (education?.result?.code == ResultCodeGrade) {
      return (
        <IntlMessages
          id='education.cgpa_out_of_scale'
          values={{
            scale: getIntlNumber(formatNumber, education.cgpa_scale),
            cgpa: getIntlNumber(formatNumber, education.cgpa),
          }}
        />
      );
    } else {
      return (
        education.result?.title +
        ', ' +
        (education.marks_in_percentage
          ? messages['education.marks'] +
            ': ' +
            getIntlNumber(formatNumber, education.marks_in_percentage)
          : '')
      );
    }
  };

  return (
    <React.Fragment>
      {educations.map((education: any) => (
        <React.Fragment key={education.id}>
          <HorizontalLine />
          <StyledGrid container spacing={{xs: 2, md: 3}}>
            <Grid item xs={12} sm={8} md={8}>
              <Box sx={{display: 'flex'}}>
                <Avatar>
                  <Verified />
                </Avatar>
                <Box sx={{marginLeft: '15px'}}>
                  <S1 sx={{...result.subtitle2}} className={classes.textStyle}>
                    {education?.education_level_title}
                    {' ('}
                    {education?.exam_degree_id
                      ? education?.exam_degree_title
                      : education?.exam_degree_name}
                    {')'}
                  </S1>
                  {education?.major_or_concentration && (
                    <Typography tabIndex={0} variant={'subtitle2'}>
                      {education.major_or_concentration}
                    </Typography>
                  )}
                  <Body2>{education?.institute_name}</Body2>
                  {education.result && (
                    <Typography tabIndex={0} variant={'subtitle2'}>
                      {messages['education.result']}: {getResult(education)}
                    </Typography>
                  )}
                  {!education?.edu_board_id &&
                    !education?.edu_group_id &&
                    education?.year_of_passing && (
                      <Typography tabIndex={0} variant={'subtitle2'}>
                        {messages['education.passing_year']}:{' '}
                        <b>
                          {getIntlNumber(
                            formatNumber,
                            education.year_of_passing,
                          )}
                        </b>
                      </Typography>
                    )}
                  {education.result?.code == ResultCodeAppeared && (
                    <Typography tabIndex={0} variant={'subtitle2'}>
                      {messages['education.expected_passing_year']}:{' '}
                      <b>
                        {getIntlNumber(
                          formatNumber,
                          education.expected_year_of_passing,
                        )}
                      </b>
                    </Typography>
                  )}
                  {education.duration && (
                    <Typography tabIndex={0} variant={'subtitle2'}>
                      {messages['education.duration']}:{' '}
                      <b>{getIntlNumber(formatNumber, education.duration)}</b>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Grid container sx={{marginTop: '10px'}}>
                  {(education?.edu_board_id || education?.edu_group_id) &&
                    education?.year_of_passing && (
                      <React.Fragment>
                        <Grid item sx={{display: 'flex'}}>
                          <AccessTime
                            color={'primary'}
                            sx={{marginRight: '5px'}}
                          />
                          <TextPrimary
                            text={getIntlNumber(
                              formatNumber,
                              education.year_of_passing,
                            )}
                          />
                        </Grid>
                      </React.Fragment>
                    )}
                  {education?.edu_board_id && (
                    <React.Fragment>
                      {education?.year_of_passing && <VerticalLine />}
                      <Grid item sx={{display: 'flex'}}>
                        <LocationOnIcon
                          color={'primary'}
                          sx={{marginRight: '5px'}}
                        />
                        <TextPrimary text={education.board_title} />
                      </Grid>
                    </React.Fragment>
                  )}
                  {education?.edu_group_id && (
                    <React.Fragment>
                      {!!(
                        education?.year_of_passing || education?.edu_board_id
                      ) && <VerticalLine />}
                      <Grid item sx={{display: 'flex'}}>
                        <CheckCircle
                          color={'primary'}
                          sx={{marginRight: '5px'}}
                        />
                        <TextPrimary text={education?.edu_group_title} />
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              </Box>

              {education.achievements && (
                <Box>
                  <Typography tabIndex={0}>
                    {messages['common.achievements']}
                  </Typography>
                  <Typography tabIndex={0}>{education.achievements}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                {education?.certificate_file_path ? (
                  <Link
                    href={
                      FILE_SERVER_FILE_VIEW_ENDPOINT +
                      education.certificate_file_path
                    }
                    target={'_blank'}
                    style={{marginRight: '10px'}}>
                    <IconButton
                      color='primary'
                      aria-label='view certificate'
                      component='span'>
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                ) : (
                  <IconButton
                    style={{marginRight: '10px'}}
                    disabled={true}
                    color='primary'
                    aria-label='view certificate'
                    component='span'>
                    <VisibilityIcon />
                  </IconButton>
                )}

                <CustomParabolaButton
                  buttonVariant={'outlined'}
                  title={messages['common.edit_btn'] as string}
                  icon={<BorderColor />}
                  onClick={() => {
                    onEditClick(education.id);
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
                      await onDeleteClick(education.id);
                    }}
                    buttonType={'delete'}
                    dialogTitle={
                      messages['confirmation_text.education'] as string
                    }
                    disabled={disabled}
                  />
                )}
              </Box>
              <Grid item xs={12} sx={{m: 1, ml: 3}}>
                <CustomCheckboxWithoutForm
                  id={`is_education_${education.id}`}
                  label={messages['common.is_show_in_cv']}
                  checked={!!showInCV[education.id]}
                  onChange={() => debounceFn(education.id)}
                  isDisabled={disabled}
                />
              </Grid>
            </Grid>
          </StyledGrid>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default Educations;
