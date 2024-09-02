import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {objectFilter} from '../../../@core/utilities/helpers';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useFetchLocalizedPublicBdJobsJobSectors} from '../../../services/organaizationManagement/hooks';
import CustomFilterableSelect from '../../learner/training/components/CustomFilterableSelect';

const PREFIX = 'JobsFilterSection';

const classes = {
  resetBtn: `${PREFIX}-resetBtn`,
  resetIconStyle: `${PREFIX}-resetIconStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',

  [`& .${classes.resetBtn}`]: {
    border: '1px solid #048340',
    borderRadius: '6px',
    height: '100%',
    paddingLeft: '6.5px',
    paddingRight: '6.5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    [`& .${classes.resetIconStyle}`]: {
      fill: theme.palette.primary.main,
      fontSize: '1.8rem',
    },
    [`&:hover, &:focus`]: {
      backgroundColor: theme.palette.primary.main,
      [`& .${classes.resetIconStyle}`]: {
        fill: theme.palette.common.white,
      },
    },
  },
}));

const JobsFilterSection = ({setJobsFilters}: any) => {
  const {messages} = useIntl();
  const [selectJobSector, setSelectJobSector] = useState('');
  // const [selectOccupation, setSetOccupation] = useState(
  //   DEFAULT_BD_JOBS_OCCUPATION,
  // );
  const {data: jobSectors, isLoading: isLoadingJobSector}: any =
    useFetchLocalizedPublicBdJobsJobSectors();

  // const {data: occupations, isLoading: isLoadingOccupations} =
  //   useFetchLocalizedPublicBdJobsOccupations();

  const handleJobSectorChange = useCallback(
    (jobSectorId: any | '') => {
      setSelectJobSector(jobSectorId);
    },
    [selectJobSector],
  );

  // const handleOccupationChange = useCallback(
  //   (occupationId: any | '') => {
  //     setSetOccupation(occupationId);
  //   },
  //   [selectOccupation],
  // );

  const searchHandler = useCallback(() => {
    setJobsFilters((prev: any) => {
      return objectFilter({
        ...prev,
        job_sector: selectJobSector,
        // occupation: selectOccupation,
      });
    });
  }, [selectJobSector]);

  const resetHandler = useCallback(() => {
    setSelectJobSector('');
    setSelectJobSector('');
    setJobsFilters({
      page_size: PageSizes.EIGHT,
      page: 1,
    });
  }, []);

  return (
    <StyledGrid container spacing={2}>
      <Grid item xs={6} md={2}>
        <CustomFilterableSelect
          id={'job_sector_ids'}
          defaultValue={selectJobSector}
          label={messages['job_sectors.label'] as string}
          onChange={handleJobSectorChange}
          options={jobSectors || []}
          isLoading={isLoadingJobSector}
          optionValueProp={'id'}
          optionTitleProp={['title']}
        />
      </Grid>{' '}
      {/*<Grid item xs={6} md={2}>*/}
      {/*  <CustomFilterableSelect*/}
      {/*    id={'occupation_ids'}*/}
      {/*    defaultValue={selectOccupation}*/}
      {/*    label={messages['common.occupation'] as string}*/}
      {/*    onChange={handleOccupationChange}*/}
      {/*    options={occupations || []}*/}
      {/*    isLoading={isLoadingOccupations}*/}
      {/*    optionValueProp={'id'}*/}
      {/*    optionTitleProp={['title']}*/}
      {/*  />*/}
      {/*</Grid>*/}
      <Grid item>
        <Button
          variant={'contained'}
          onClick={searchHandler}
          endIcon={<SearchIcon />}
          sx={{p: '7px 16px'}}>
          {messages['common.search']}
        </Button>
      </Grid>
      <Grid item>
        <Box
          onClick={resetHandler}
          tabIndex={0}
          role='button'
          aria-label={'Reset'}
          className={classes.resetBtn}>
          <RefreshIcon className={classes.resetIconStyle} />
        </Box>
      </Grid>
    </StyledGrid>
  );
};

export default JobsFilterSection;
