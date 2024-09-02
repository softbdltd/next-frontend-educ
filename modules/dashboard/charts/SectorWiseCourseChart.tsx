import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import React, {useEffect, useState, useCallback} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useIntl} from 'react-intl';
import {localizedNumbers} from '../../../@core/utilities/helpers';
import {useFetchDashboardSectorWiseCourses} from '../../../services/global/hooks';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import {useBreakPointDown} from '../../../@core/utility/Utils';

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

const COLORS = [
  '#92316d',
  '#d4b82f',
  '#c3bfa1',
  '#fc554b',
  '#7acf9a',
  '#84066a',
  '#364cb5',
  '#b9a477',
  '#03b223',
  '#1e1929',
  '#5068e2',
  '#e7a467',
  '#14db08',
  '#83239f',
  '#a9cc24',
  '#cc79f0',
];

const SectorWiseCourseChart = () => {
  const {messages, locale} = useIntl();
  const [chartData, setChartData] = useState<any>([]);
  const {data: statisticsData} = useFetchDashboardSectorWiseCourses();
  const minimumTextSize = useBreakPointDown('md') ? 9 : 15;

  useEffect(() => {
    if (statisticsData) {
      setChartData(statisticsData.filter((item: any) => item.courses !== 0));
    }
  }, [statisticsData, locale]);

  const CustomTooltip = ({payload, active}: any) => {
    if (active && payload && payload.length) {
      const {payload: data} = payload[0];
      return (
        <Card>
          <CardContent>
            <Typography>{data.title}</Typography>
            <Typography>
              {messages['common.total_course']}:{' '}
              {`${localizedNumbers(data.courses, locale)}`}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const RenderCustomizedLabel = useCallback(
    ({cx, cy, midAngle, innerRadius, outerRadius, index}: any) => {
      const RADIAN = Math.PI / 180;
      const radius = 25 + innerRadius + (outerRadius - innerRadius);
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill='#8884d8'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'>
          {chartData[index]?.title.length >= minimumTextSize
            ? chartData[index]?.title.substring(0, minimumTextSize) + '...'
            : chartData[index]?.title}
        </text>
      );
    },
    [chartData, minimumTextSize],
  );

  return (
    <StyledBox>
      <Card>
        <CardHeader title={messages['dashboard.course_sector']} />

        <CardContent>
          <ResponsiveContainer width={'100%'} height={380}>
            {chartData?.length > 0 ? (
              <PieChart width={200} height={200}>
                <Pie
                  data={chartData || []}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='courses'
                  label={RenderCustomizedLabel}
                  isAnimationActive={false}
                  nameKey={'title'}
                  fill='#2F80ED'>
                  {chartData.map((val: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <NoDataFoundComponent sx={{pt: 5, justifyContent: 'center'}} />
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </StyledBox>
  );
};

export default SectorWiseCourseChart;
