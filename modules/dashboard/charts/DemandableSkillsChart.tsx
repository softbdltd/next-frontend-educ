import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useIntl} from 'react-intl';
import {useFetchDashboardDemandableSkills} from '../../../services/global/hooks';
import {localizedNumbers} from '../../../@core/utilities/helpers';
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

const SkillTrendsChartForInstitute = () => {
  const {messages, locale} = useIntl();

  const barChartSize: number = 18;

  const [chartData, setChartData] = useState<any>([]);

  const {data: statisticsData} = useFetchDashboardDemandableSkills();

  useEffect(() => {
    if (statisticsData) {
      let stateData: any = [];
      statisticsData.map((data: any) => {
        if (data.title.length > 10) {
          data.yAxisName = data.title.substring(0, 10) + '...';
          stateData.push(data);
        } else {
          data.yAxisName = data.title;
          stateData.push(data);
        }
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
            <Typography>{data.title}</Typography>
            <Typography>
              {messages['dashboard.Demands']}:{' '}
              {`${localizedNumbers(data.demand, locale)}`}
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
        <CardHeader title={messages['dashboard.SkillsTrend']} />
        <CardContent>
          <ResponsiveContainer width={'100%'} height={380}>
            {chartData?.length > 0 ? (
              <BarChart
                width={220}
                height={300}
                barSize={barChartSize}
                data={chartData}
                layout={'horizontal'}
                margin={{
                  top: 0,
                  right: 0,
                  left: -20,
                  bottom: 50,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <YAxis type='number' />
                <XAxis
                  type='category'
                  dataKey='yAxisName'
                  interval={0}
                  angle={-45}
                  textAnchor='end'
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey='demand' fill='#4B66F1' />
              </BarChart>
            ) : (
              <NoDataFoundComponent sx={{pt: 5, justifyContent: 'center'}} />
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </StyledBox>
  );
};

export default SkillTrendsChartForInstitute;
