import {
  Box,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import RowStatus from '../../../@core/utilities/RowStatus';
import {
  useFetchConstituencies,
  useFetchInstituteWiseJobFair,
} from '../../../services/cmsManagement/hooks';
import {
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
} from '../../../services/locationManagement/hooks';
import CustomFilterableSelect from '../../learner/training/components/CustomFilterableSelect';

const PREFIX = '';

const classes = {
  table: `${PREFIX}-table`,
};

export const StyledBox = styled(Box)(({theme}) => ({
  marginTop: '40px',
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
  padding: '15px',
  borderRadius: '10px',
  boxShadow: '0px 2px 5px 5px #e9e9e9',
  [`& .${classes.table}`]: {
    marginTop: '20px',
    marginBottom: '5px',
    [`& .MuiTableHead-root .MuiTableCell-root `]: {
      background: '#e9f2fe',
    },
    [`& .MuiTableCell-root `]: {
      border: '1px solid #e0e0e0',
      padding: '5px',
      [`& div`]: {
        textAlign: 'center',
      },
    },
  },
}));

const InstituteWiseJobInformation = ({filterState}: any) => {
  const {messages, formatNumber} = useIntl();
  const page = useRef<any>(1);
  const tableRef = useRef<any>();
  const [selectedState, setSelectedState] = useState<any>({
    division_id: '',
    district_id: '',
    constituency_id: '',
  });
  const [divisionsFilter] = useState<any>({row_status: RowStatus.ACTIVE});
  const [districtsFilter, setDistrictsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: divisions} = useFetchLocalizedDivisions(divisionsFilter);
  const {data: districts} = useFetchLocalizedDistricts(districtsFilter);

  const [constituenciesFilter, setConstituenciesFilter] = useState<any>(null);
  const {data: constituencies} = useFetchConstituencies(constituenciesFilter);

  const [dataFilters, setDataFilters] = useState<any>({
    page: 1,
    page_size: 10,
  });
  const {
    data: instituteWiseData,
    isLoading: isLoadingData,
    metaData,
  } = useFetchInstituteWiseJobFair(dataFilters);

  useEffect(() => {
    tableRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSelectedState((prev: any) => {
      return {
        ...prev,
        division_id: filterState?.division_id,
        district_id: filterState?.district_id,
        constituency_id: filterState?.constituency_id,
      };
    });

    setConstituenciesFilter(
      filterState?.district_id
        ? {
            loc_district_id: filterState?.district_id,
          }
        : null,
    );

    setDataFilters((prev: any) => {
      return {
        ...prev,
        page: page.current,
        loc_constituency_id: filterState?.constituency_id,
      };
    });
  }, [filterState]);

  const handleDivisionChange = useCallback((divisionId: any) => {
    page.current = 1;
    setSelectedState((prev: any) => {
      return {
        ...prev,
        division_id: divisionId,
        district_id: '',
        constituency_id: '',
      };
    });
    setDistrictsFilter((prev: any) => {
      return {
        ...prev,
        loc_division_id: divisionId,
      };
    });

    setDataFilters((prev: any) => {
      return {
        ...prev,
        page: page.current,
        loc_division_id: divisionId,
        loc_district_id: null,
        loc_constituency_id: null,
      };
    });
  }, []);

  const handleDistrictChange = useCallback((districtId: any) => {
    page.current = 1;
    setSelectedState((prev: any) => {
      return {
        ...prev,
        district_id: districtId,
        constituency_id: '',
      };
    });
    setConstituenciesFilter(
      districtId
        ? {
            loc_district_id: districtId,
          }
        : null,
    );
    setDataFilters((prev: any) => {
      return {
        ...prev,
        page: page.current,
        loc_district_id: districtId,
        loc_constituency_id: null,
      };
    });
  }, []);

  const handleConstituencyChange = useCallback((constituencyId: any) => {
    page.current = 1;
    setSelectedState((prev: any) => {
      return {
        ...prev,
        constituency_id: constituencyId,
      };
    });
    setDataFilters((prev: any) => {
      return {
        ...prev,
        page: page.current,
        loc_constituency_id: constituencyId,
      };
    });
  }, []);

  const onPaginationChange = useCallback((event: any, currentPage: number) => {
    page.current = currentPage;
    setDataFilters((params: any) => {
      return {...params, page: currentPage};
    });
  }, []);
  return (
    <StyledBox>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box fontWeight='fontWeightBold' sx={{fontSize: '25px'}}>
          {messages['job_fair_dashboard.institute_wise_jon_information']}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ['& .filter-item']: {
              width: '140px',
              marginLeft: '10px',
            },
          }}>
          <Typography>{messages['common.filter']}</Typography>
          <Box className={'filter-item'}>
            <CustomFilterableSelect
              id={'loc_division_id'}
              defaultValue={selectedState.division_id}
              label={messages['menu.division'] as string}
              onChange={handleDivisionChange}
              options={divisions}
              isLoading={false}
              optionValueProp={'id'}
              optionTitleProp={['title']}
            />
          </Box>
          <Box className={'filter-item'}>
            <CustomFilterableSelect
              id={'loc_district_id'}
              defaultValue={selectedState.district_id}
              label={messages['menu.district'] as string}
              onChange={handleDistrictChange}
              options={districts}
              isLoading={false}
              optionValueProp={'id'}
              optionTitleProp={['title']}
            />
          </Box>
          <Box className={'filter-item'}>
            <CustomFilterableSelect
              id={'constituency_id'}
              defaultValue={selectedState.constituency_id}
              label={messages['common.parliament_area'] as string}
              onChange={handleConstituencyChange}
              options={constituencies}
              isLoading={false}
              optionValueProp={'id'}
              optionTitleProp={['constituency_name']}
            />
          </Box>
        </Box>
      </Box>
      <Box ref={tableRef} id={'job_delivary_table'}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} width={'100px'}>
                <div>
                  {messages['job_fair_dashboard.institute_table.serial_no']}
                </div>
              </TableCell>
              <TableCell rowSpan={2} width={'300px'}>
                <div>
                  {
                    messages[
                      'job_fair_dashboard.institute_table.institute_name'
                    ]
                  }
                </div>
              </TableCell>
              <TableCell colSpan={3}>
                <div>
                  {messages['job_fair_dashboard.institute_table.job_demand']}
                </div>
              </TableCell>
              <TableCell colSpan={3}>
                <div>
                  {messages['job_fair_dashboard.institute_table.cv_submit']}
                </div>
              </TableCell>
              <TableCell rowSpan={2} width={'120px'}>
                <div>
                  {
                    messages[
                      'job_fair_dashboard.institute_table.onspot_job_delivery'
                    ]
                  }
                </div>
              </TableCell>
              <TableCell rowSpan={2}>
                <div>
                  {
                    messages[
                      'job_fair_dashboard.institute_table.designation_name'
                    ]
                  }
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'100px'}>
                <div>
                  {
                    messages[
                      'job_fair_dashboard.institute_table.total_male_female'
                    ]
                  }
                </div>
              </TableCell>
              <TableCell width={'100px'}>
                <div>{messages['common.male']}</div>
              </TableCell>
              <TableCell width={'100px'}>
                <div>{messages['common.female']}</div>
              </TableCell>
              <TableCell width={'100px'}>
                <div>
                  {
                    messages[
                      'job_fair_dashboard.institute_table.total_male_female'
                    ]
                  }
                </div>
              </TableCell>
              <TableCell width={'100px'}>
                <div>{messages['common.male']}</div>
              </TableCell>
              <TableCell width={'100px'}>
                <div>{messages['common.female']}</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingData ? (
              <TableRow>
                <TableCell colSpan={100}>
                  <Box
                    sx={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#5b5b5b',
                      height: '340px',
                      display: 'flex',
                    }}>
                    <span style={{margin: 'auto'}}>
                      {messages['common.loading_data']}
                    </span>
                  </Box>
                </TableCell>
              </TableRow>
            ) : instituteWiseData && instituteWiseData?.length > 0 ? (
              instituteWiseData.map((data: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell width={'100px'}>
                      <div>{formatNumber(index + 1)}</div>
                    </TableCell>
                    <TableCell width={'300px'}>
                      {data.job_providing_institution_name}
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_jobs_demand_learners ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_jobs_demand_males ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_jobs_demand_females ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_cv_submitted_learners ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_cv_submitted_male ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'100px'}>
                      <div>
                        {formatNumber(
                          data.institution_wise_cv_submitted_female ?? 0,
                        )}
                      </div>
                    </TableCell>
                    <TableCell width={'120px'}>
                      {formatNumber(
                        data.institution_wise_on_spot_job_provider ?? 0,
                      )}
                    </TableCell>
                    <TableCell>
                      {data.institution_wise_on_spot_job_post}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={100}>
                  <Box
                    sx={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#5b5b5b',
                    }}>
                    {messages['common.no_data_found']}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Stack spacing={2}>
          <Pagination
            page={page.current}
            count={metaData?.total_page}
            color={'primary'}
            shape='rounded'
            onChange={onPaginationChange}
          />
        </Stack>
      </Box>
    </StyledBox>
  );
};

export default InstituteWiseJobInformation;
