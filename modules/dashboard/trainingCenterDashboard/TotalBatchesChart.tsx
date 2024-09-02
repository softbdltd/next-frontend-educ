import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useIntl} from 'react-intl';
import CustomFilterableSelect from '../../learner/training/components/CustomFilterableSelect';
import {
  generateOfYears,
  localizedNumbers,
} from '../../../@core/utilities/helpers';
import {useFetchTrainingCenterDashboardYearlyBatch} from '../../../services/instituteManagement/hooks';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';

const StyledBox = styled(Box)(({theme}) => ({
  [`& .MuiCardHeader-title`]: {
    fontSize: '1.4rem',
    [theme.breakpoints.up('xs')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.3rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.6rem',
    },
    color: '#000',
    fontWeight: 400,
  },
}));

const TotalBatchesChart = () => {
  const {messages, locale, formatDate} = useIntl();

  const [chartData, setChartData] = useState<any>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [statisticsParams, setStatisticsParams] = useState<any>({
    year: new Date().getFullYear(),
  });

  const {data: statisticsData} =
    useFetchTrainingCenterDashboardYearlyBatch(statisticsParams);

  const onChangeYear = useCallback(
    (year: string) => {
      if (year && Number(year) !== selectedYear) {
        setSelectedYear(Number(year));
        setStatisticsParams({year});
      }
    },
    [selectedYear],
  );

  const formatDateOfMonthLocalized = (monthId: number, short?: boolean) => {
    const today = new Date();
    today.setMonth(monthId);
    if (short) {
      return locale === 'en-US'
        ? formatDate(today, {month: 'long'}).substring(0, 3)
        : formatDate(today, {month: 'long'}).substring(0, 5);
    }

    return formatDate(today, {month: 'long'});
  };

  const listOfYears = useMemo(() => generateOfYears(locale), [locale]);

  useEffect(() => {
    if (statisticsData) {
      let stateData: any = [];
      statisticsData.map((data: any) => {
        data.yAxisName = formatDateOfMonthLocalized(data.month - 1);
        stateData.push(data);
      });
      setChartData(stateData);
    }
  }, [statisticsData, locale]); //later add deps [dashData]

  const CustomTooltip = ({payload, active}: any) => {
    if (active && payload && payload.length) {
      const {payload: data} = payload[0];
      return (
        <Card>
          <CardContent>
            <Typography>
              {formatDateOfMonthLocalized(data.month - 1)}
            </Typography>
            <Typography>
              {messages['dashboard.TotalBatches']}:{' '}
              {`${localizedNumbers(data.batches, locale)}`}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <StyledBox>
      <Card>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <CardHeader title={messages['dashboard.TotalBatches']} />
          <Box sx={{width: '50%', paddingRight: '10px', marginTop: '10px'}}>
            <CustomFilterableSelect
              id={'demo-year-select'}
              label={messages['dashboard.Year']}
              isLoading={false}
              options={listOfYears}
              optionValueProp={'key'}
              optionTitleProp={['label']}
              defaultValue={selectedYear ?? ''}
              onChange={(value: any) => onChangeYear(value)}
            />
          </Box>
        </div>
        <CardContent>
          <ResponsiveContainer width={'100%'} height={300}>
            {chartData?.length > 0 ? (
              <LineChart
                data={chartData}
                margin={{
                  top: 0,
                  right: 0,
                  left: -20,
                  bottom: 40,
                }}>
                <CartesianGrid strokeDasharray='0 0' />
                <XAxis
                  type='category'
                  dataKey='yAxisName'
                  interval={0}
                  angle={-45}
                  textAnchor='end'
                  padding={{right: 5}}
                />
                <YAxis tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {/*<Legend />*/}
                <Line
                  legendType={'none'}
                  dot={false}
                  type='monotone'
                  dataKey='batches'
                  strokeWidth={7}
                  stroke={'#2F80ED'}
                  // activeDot={{r: 9}}
                />
              </LineChart>
            ) : (
              <NoDataFoundComponent sx={{pt: 5, justifyContent: 'center'}} />
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </StyledBox>
  );
};

export default TotalBatchesChart;
