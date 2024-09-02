import {Search} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {H1} from '../../../@core/elements/common';
import {
  getShowInTypeByDomain,
  objectFilter,
} from '../../../@core/utilities/helpers';
import RowStatus from '../../../@core/utilities/RowStatus';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import {
  useFetchPublicInstitutes,
  useFetchPublicOnlineInstitutes,
  useFetchPublicPrograms,
} from '../../../services/instituteManagement/hooks';
import {useFetchLocalizedDistricts} from '../../../services/locationManagement/hooks';
import {FilterItem} from '../../../shared/Interface/common.interface';
import {CourseType} from '../../dashboard/courses/CourseEnums';
import CustomFilterableSelect from './components/CustomFilterableSelect';

const PREFIX = 'CustomListHeaderSection';

export const classes = {
  thinSearchButton: `${PREFIX}-thinSearchButton`,
  searchInputBorderHide: `${PREFIX}-searchInputBorderHide`,
  filterBox: `${PREFIX}-filterBox`,
};

export const StyledBox = styled(Box)(({theme}) => ({
  background: theme.palette.primary.main,
  color: '#fff',
  paddingTop: 20,
  paddingBottom: 20,
  borderTop: `1px solid ${theme.palette.primary.dark}`,

  [`& .${classes.thinSearchButton}`]: {
    color: '#fff',
    padding: '10px 0',
    width: '100%',
    height: '100%',
  },

  [`& .${classes.searchInputBorderHide}`]: {
    padding: 0,
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      display: 'flex',
      alignItems: 'center',
      // padding: '14px 0px',
    },
  },
  [`& .${classes.filterBox}`]: {
    margin: 'auto',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '910px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '760px',
    },
  },
}));

interface CourseListHeaderSection {
  addFilterKey: (filterKey: string, filterValue: any) => void;
  routeParamsFilters?: (filters: Array<FilterItem>) => void;
  // setCourseMode: any;
}

const CourseListHeaderSection = ({
  addFilterKey,
  routeParamsFilters,
}: CourseListHeaderSection) => {
  const {messages} = useIntl();
  const router = useRouter();
  const showInType = getShowInTypeByDomain();
  const [instituteFilters] = useState({});

  const [selectedInstituteId, setSelectedInstituteId] = useState<any>('');
  const [selectedCourseTypeId, setSelectedCourseTypeId] = useState<any>('');
  const searchTextField = useRef<any>();

  const [selectedProgrammeId, setSelectedProgrammeId] = useState<any>('');
  const [selectedLocDistrictId, setSelectedLocDistrictId] = useState<any>('');
  const [selectedAvailability, setSelectedAvailability] = useState<any>('1');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<any>('');
  const [selectedType, setSelectedType] = useState<any>(CourseType.OFFLINE);

  const [selectMuktoPathInstitute, setSelectMuktoPathInstitute] = useState('');
  const {search_text} = router.query;

  const [programmeFilters, setProgrammeFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [districtFilter, setDistrictFilter] = useState<any>(null);

  useEffect(() => {
    setSelectedAvailability(router?.query?.availability);
    // setSelectedType(router?.query?.is_offline);
  }, [router?.query]);

  // const ONLINE_OR_OFFLINE = useMemo(
  //   () => [
  //     {id: 1, title: messages['common.online']},
  //     {id: 2, title: messages['common.offline']},
  //   ],
  //   [messages],
  // );

  const SKILL_LEVELS = useMemo(
    () => [
      {id: 1, title: messages['common.beginner']},
      {id: 2, title: messages['common.intermediate']},
      {id: 3, title: messages['common.expert']},
    ],
    [messages],
  );

  const AVAILABILITIES = useMemo(
    () => [
      {id: 1, title: messages['common.running']},
      {id: 2, title: messages['common.upcoming']},
    ],
    [messages],
  );

  const COURSE_TYPES = useMemo(
    () => [
      {id: 1, title: messages['course.paid']},
      {id: 2, title: messages['course.free']},
    ],
    [messages],
  );

  const {data: institutes} = useFetchPublicInstitutes(instituteFilters);
  const {data: onlineInstitutes, isLoading: isLoadingOnlineInstitute} =
    useFetchPublicOnlineInstitutes(instituteFilters);

  const {data: programmes} = useFetchPublicPrograms(programmeFilters);
  const {data: districts} = useFetchLocalizedDistricts(districtFilter);

  // const handleCourseOnlineOrOfflineChange = useCallback(
  //   (type: number | string | null) => {
  //     setSelectedType(type);
  //     setCourseMode(type);
  //     // addFilterKey('is_offline', type);
  //
  //     if (type == CourseType.ONLINE) {
  //       urlParamsUpdate({
  //         institute_id: '',
  //         search_text: '',
  //         program_id: '',
  //         course_type: '',
  //         level: '',
  //         availability: '',
  //         district: '',
  //         // owner_id: '',
  //         // is_offline: type,
  //       });
  //     } else {
  //       urlParamsUpdate({
  //         owner_id: '',
  //         // is_offline: type,
  //       });
  //     }
  //   },
  //   [],
  // );

  const handleMuktoPathInstituteChange = useCallback(
    (instituteId: any | '') => {
      setSelectMuktoPathInstitute(instituteId ? instituteId : null);
      addFilterKey('owner_id', instituteId);
      urlParamsUpdate({
        owner_id: instituteId,
        institute_id: '',
      });
    },
    [selectMuktoPathInstitute],
  );

  useEffect(() => {
    setDistrictFilter({row_status: RowStatus.ACTIVE});
  }, []);

  useEffect(() => {
    addFilterKey('availability', 1);
    urlParamsUpdate({
      // is_offline: router?.query?.is_offline
      //   ? router?.query?.is_offline
      //   : CourseType.OFFLINE,
      availability: 1,
    });
  }, []);

  useEffect(() => {
    let params: any = {...router.query};
    console.log('params useEffect', params);
    let filters: Array<FilterItem> = [];

    if (params.search_text) {
      filters.push({
        filterKey: 'search_text',
        filterValue: params.search_text,
      });
    }

    if (!Number(params.institute_id)) {
      delete params.institute_id;
      setSelectedInstituteId('');
    } else {
      filters.push({
        filterKey: 'institute_id',
        filterValue: params.institute_id,
      });
      setSelectedInstituteId(params.institute_id);
    }
    if (!Number(params.owner_id)) {
      delete params.owner_id;
      setSelectMuktoPathInstitute('');
    } else {
      filters.push({
        filterKey: 'owner_id',
        filterValue: params.owner_id,
      });
      setSelectMuktoPathInstitute(params.owner_id);
    }

    if (!Number(params.program_id)) {
      delete params.program_id;
    } else {
      filters.push({
        filterKey: 'program_id',
        filterValue: params.program_id,
      });
      setSelectedProgrammeId(params.program_id);
    }

    if (!Number(params.course_type)) {
      delete params.course_type;
    } else {
      filters.push({
        filterKey: 'course_type',
        filterValue: params.course_type,
      });
      setSelectedCourseTypeId(params.course_type);
    }

    if (!Number(params.level)) {
      delete params.level;
    } else {
      filters.push({
        filterKey: 'level',
        filterValue: params.level,
      });
      setSelectedSkillLevel(params.level);
    }

    if (!Number(params.availability)) {
      delete params.availability;
    } else {
      filters.push({
        filterKey: 'availability',
        filterValue: params.availability,
      });
      setSelectedAvailability(params.availability);
    }

    if (!Number(params.district)) {
      delete params.district;
    } else {
      filters.push({
        filterKey: 'loc_district_id',
        filterValue: params.district,
      });
      setSelectedLocDistrictId(params.district);
    }

    if (routeParamsFilters && filters.length > 0) {
      routeParamsFilters(filters);
    }
  }, [router.query]);

  const urlParamsUpdate = (params: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: objectFilter({...router.query, ...params}),
      },
      undefined,
      {shallow: true},
    );
  };

  const handleInstituteFilterChange = useCallback(
    (instituteId: number | null) => {
      setSelectedInstituteId(instituteId);
      setProgrammeFilters(
        objectFilter({
          row_status: RowStatus.ACTIVE,
          institute_id: instituteId,
          owner_id: '',
        }),
      );
      addFilterKey('institute_id', instituteId);
      if (!instituteId) {
        addFilterKey('program_id', 0);
      }

      urlParamsUpdate({
        institute_id: instituteId,
        program_id: '',
        owner_id: '',
      });
    },
    [selectedInstituteId, router.query],
  );

  const handleProgrammeFilterChange = useCallback(
    (programId: number | null) => {
      setSelectedProgrammeId(programId);
      addFilterKey('program_id', programId);
      urlParamsUpdate({program_id: programId});
    },
    [selectedProgrammeId, router.query],
  );

  const handleAvailabilityChange = useCallback(
    (availability: number | null) => {
      setSelectedAvailability(availability);
      addFilterKey('availability', availability);
      urlParamsUpdate({availability: availability});
    },
    [selectedAvailability, router.query],
  );

  const handleCourseTypeChange = useCallback(
    (courseType: number | null) => {
      setSelectedCourseTypeId(courseType);
      addFilterKey('course_type', courseType);
      urlParamsUpdate({course_type: courseType});
    },
    [router.query],
  );

  const handleDistrictChange = useCallback(
    (districtId: number | null) => {
      setSelectedLocDistrictId(districtId);
      addFilterKey('loc_district_id', districtId);
      urlParamsUpdate({district: districtId});
    },
    [selectedLocDistrictId, router.query],
  );

  const handleSkillLevelChange = useCallback(
    (skillLevel: number | null) => {
      setSelectedSkillLevel(skillLevel);
      addFilterKey('level', skillLevel);
      urlParamsUpdate({level: skillLevel});
    },
    [router.query],
  );

  const onClickResetButton = useCallback(() => {
    if (showInType !== ShowInTypes.TSP) {
      setSelectedInstituteId('');
      addFilterKey('institute_id', null);

      setSelectMuktoPathInstitute('');
      addFilterKey('owner_id', null);
    }

    searchTextField.current.value = '';
    addFilterKey('search_text', '');
    setSelectedType('');

    setSelectedProgrammeId('');
    addFilterKey('program_id', null);
    setSelectedCourseTypeId('');
    addFilterKey('course_type', null);
    setSelectedSkillLevel('');
    addFilterKey('level', null);
    setSelectedAvailability('');
    addFilterKey('availability', null);
    setSelectedLocDistrictId('');
    addFilterKey('loc_district_id', null);
    urlParamsUpdate({
      institute_id: '',
      search_text: '',
      program_id: '',
      course_type: '',
      level: '',
      availability: '1',
      district: '',
      owner_id: '',
      // is_offline: CourseType.OFFLINE,
    });
  }, []);

  const onSearchClick = useCallback(() => {
    addFilterKey('search_text', searchTextField.current.value);
    urlParamsUpdate({search_text: searchTextField.current.value});
  }, [router.query]);

  return (
    <StyledBox>
      <Container maxWidth={'lg'}>
        <Grid container spacing={3} sx={{justifyContent: 'center'}}>
          <Grid item xs={12} md={7}>
            <H1 style={{fontSize: '1rem'}}>
              {messages['training.search_header']}
            </H1>
            <Card sx={{alignItems: 'center'}}>
              <Grid container spacing={3} sx={{alignItems: 'center'}}>
                <Grid item xs={8} sm={9}>
                  <TextField
                    inputRef={searchTextField}
                    variant='outlined'
                    name='searchBox'
                    placeholder={messages['common.search'] as string}
                    fullWidth
                    defaultValue={search_text ? search_text : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position='start'
                          sx={{marginLeft: '20px'}}>
                          <Search />
                        </InputAdornment>
                      ),
                      className: classes.searchInputBorderHide,
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={3} sx={{paddingRight: '4px'}}>
                  <Button
                    variant='contained'
                    color={'primary'}
                    className={classes.thinSearchButton}
                    onClick={onSearchClick}>
                    {messages['common.search']}
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} display={'flex'} alignItems={'flex-end'}>
            <Button
              fullWidth
              variant={'contained'}
              color={'secondary'}
              size={'small'}
              sx={{
                height: '48px',
                marginBottom: '6px',
              }}
              onClick={onClickResetButton}>
              {messages['common.reset']}
            </Button>
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid
              container
              spacing={{xs: 1, sm: 2, md: 3}}
              className={classes.filterBox}>
              {/*<Grid item xs={6} sm={4} md={4}>*/}
              {/*  <CustomFilterableSelect*/}
              {/*    id={'is_offline'}*/}
              {/*    defaultValue={selectedType}*/}
              {/*    label={messages['course.type'] as string}*/}
              {/*    onChange={handleCourseOnlineOrOfflineChange}*/}
              {/*    options={ONLINE_OR_OFFLINE}*/}
              {/*    isLoading={false}*/}
              {/*    optionValueProp={'id'}*/}
              {/*    optionTitleProp={['title']}*/}
              {/*  />*/}
              {/*</Grid>*/}
              {showInType != ShowInTypes.TSP &&
                selectedType == CourseType.ONLINE && (
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'owner_id'}
                      defaultValue={selectMuktoPathInstitute}
                      label={
                        messages['institute.skills_service_provider'] as string
                      }
                      onChange={handleMuktoPathInstituteChange}
                      options={onlineInstitutes || []}
                      isLoading={isLoadingOnlineInstitute}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                )}
              {showInType != ShowInTypes.TSP &&
                selectedType == CourseType.OFFLINE && (
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'institute_id'}
                      defaultValue={selectedInstituteId}
                      label={messages['common.institute'] as string}
                      onChange={handleInstituteFilterChange}
                      options={institutes}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                )}

              {selectedType == CourseType.OFFLINE && (
                <>
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'program_id'}
                      defaultValue={selectedProgrammeId}
                      label={messages['common.program_2'] as string}
                      onChange={handleProgrammeFilterChange}
                      options={programmes}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'level'}
                      defaultValue={selectedSkillLevel}
                      label={messages['common.skill_level'] as string}
                      onChange={handleSkillLevelChange}
                      options={SKILL_LEVELS}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'course_type'}
                      defaultValue={selectedCourseTypeId}
                      label={messages['common.course_type'] as string}
                      onChange={handleCourseTypeChange}
                      options={COURSE_TYPES}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'availability'}
                      defaultValue={selectedAvailability}
                      label={messages['course.availability'] as string}
                      onChange={handleAvailabilityChange}
                      options={AVAILABILITIES}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>

                  <Grid item xs={6} sm={4} md={4}>
                    <CustomFilterableSelect
                      id={'loc_district_id'}
                      defaultValue={selectedLocDistrictId}
                      label={messages['menu.district'] as string}
                      onChange={handleDistrictChange}
                      options={districts}
                      isLoading={false}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </StyledBox>
  );
};

export default CourseListHeaderSection;
