import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {objectFilter} from '../../../@core/utilities/helpers';
import PageSizes from '../../../@core/utilities/PageSizes';
import {
  useFetchPublicInstitutes,
  useFetchPublicOnlineInstitutes,
} from '../../../services/instituteManagement/hooks';
import {useFetchLocalizedDistricts} from '../../../services/locationManagement/hooks';
import {CourseType} from '../../dashboard/courses/CourseEnums';
import RowStatus from '../../dashboard/users/RowStatus';
import CustomFilterableSelect from '../../learner/training/components/CustomFilterableSelect';

const PREFIX = 'SkillsSection';

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

const SkillsFilterSection = ({setSkillsFilters, setCourseMode}: any) => {
  const {messages} = useIntl();
  const [districtsFilter] = useState({row_status: RowStatus.ACTIVE});
  const [institutesFilter] = useState({row_status: RowStatus.ACTIVE});
  const [selectLocation, setSelectLocation] = useState('');
  const [selectInstitute, setSelectInstitute] = useState('');
  const [selectMuktoPathInstitute, setSelectMuktoPathInstitute] = useState('');
  const [selectedType, _setSelectedType] = useState<any>(CourseType.OFFLINE);

  const {data: districts, isLoading: isLoadingDistricts} =
    useFetchLocalizedDistricts(districtsFilter);
  const {data: institutes, isLoading: isLoadingInstitute} =
    useFetchPublicInstitutes(institutesFilter);
  const {data: onlineInstitutes, isLoading: isLoadingOnlineInstitute} =
    useFetchPublicOnlineInstitutes(institutesFilter);

  const handleLocationChange = useCallback(
    (districtId: any | '') => {
      setSelectLocation(districtId ? districtId : null);
    },
    [selectLocation],
  );
  /*  const ONLINE_OR_OFFLINE = useMemo(
    () => [
      {id: 1, title: messages['common.online']},
      {id: 2, title: messages['common.offline']},
    ],
    [messages],
  );
  const handleCourseTypeChange = useCallback(
    (type: number | null) => {
      setSelectedType(type);
      setCourseMode(type);
    },
    [selectedType],
  );*/

  const handleInstituteChange = useCallback(
    (instituteId: any | '') => {
      setSelectInstitute(instituteId ? instituteId : null);
    },
    [selectInstitute],
  );

  const handleMuktoPathInstituteChange = useCallback(
    (instituteId: any | '') => {
      setSelectMuktoPathInstitute(instituteId ? instituteId : null);
      //   handling filter
      setSkillsFilters((prev: any) => {
        return objectFilter({
          ...prev,
          owner_id: instituteId,
        });
      });
    },
    [selectMuktoPathInstitute],
  );

  const searchHandler = useCallback(() => {
    setSkillsFilters((prev: any) => {
      return objectFilter({
        ...prev,
        loc_district_id: selectLocation,
        institute_id: selectInstitute,
      });
    });
  }, [selectLocation, selectInstitute]);

  const resetHandler = useCallback(() => {
    setSelectLocation('');
    setSelectInstitute('');
    setSelectMuktoPathInstitute('');
    setSkillsFilters({
      page_size: PageSizes.EIGHT,
      page: 1,
    });
  }, []);

  return (
    <StyledGrid container spacing={2}>
      {selectedType == CourseType.OFFLINE && (
        <Grid item xs={12} sm={6} md={2}>
          <CustomFilterableSelect
            id={'loc_district_id'}
            defaultValue={selectLocation}
            label={messages['common.location'] as string}
            onChange={handleLocationChange}
            options={districts || []}
            isLoading={isLoadingDistricts}
            optionValueProp={'id'}
            optionTitleProp={['title']}
          />
        </Grid>
      )}
      {selectedType == CourseType.OFFLINE ? (
        <Grid item xs={12} sm={6} md={2.5}>
          <CustomFilterableSelect
            id={'institute_id'}
            defaultValue={selectInstitute}
            label={messages['institute.skills_service_provider'] as string}
            onChange={handleInstituteChange}
            options={institutes || []}
            isLoading={isLoadingInstitute}
            optionValueProp={'id'}
            optionTitleProp={['title']}
          />
        </Grid>
      ) : (
        <Grid item xs={12} sm={6} md={2.5}>
          <CustomFilterableSelect
            id={'owner_id'}
            defaultValue={selectMuktoPathInstitute}
            label={messages['institute.skills_service_provider'] as string}
            onChange={handleMuktoPathInstituteChange}
            options={onlineInstitutes || []}
            isLoading={isLoadingOnlineInstitute}
            optionValueProp={'id'}
            optionTitleProp={['title']}
          />
        </Grid>
      )}
      {/*<Grid item xs={12} sm={6} md={2.5}>*/}
      {/*  <CustomFilterableSelect*/}
      {/*    id={'online_or_offline'}*/}
      {/*    defaultValue={selectedType}*/}
      {/*    label={messages['course.type'] as string}*/}
      {/*    onChange={handleCourseTypeChange}*/}
      {/*    options={ONLINE_OR_OFFLINE}*/}
      {/*    isLoading={false}*/}
      {/*    optionValueProp={'id'}*/}
      {/*    optionTitleProp={['title']}*/}
      {/*  />*/}
      {/*</Grid>*/}
      {selectedType == CourseType.OFFLINE && (
        <Grid item>
          <Button
            variant={'contained'}
            onClick={searchHandler}
            endIcon={<SearchIcon />}
            sx={{p: '7px 16px'}}>
            {messages['common.search']}
          </Button>
        </Grid>
      )}
      <Grid item>
        <Box
          className={classes.resetBtn}
          onClick={resetHandler}
          tabIndex={0}
          role='button'
          aria-label={'Reset'}>
          <RefreshIcon className={classes.resetIconStyle} />
        </Box>
      </Grid>
    </StyledGrid>
  );
};

export default SkillsFilterSection;
