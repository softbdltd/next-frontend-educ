import {Card, CardContent, CardHeader, Stack, Typography} from '@mui/material';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useIntl} from 'react-intl';
import {localizedNumbers} from '../../../@core/utilities/helpers';
import {useFetchDashboardEmploymentStatus} from '../../../services/global/hooks';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import {useBreakPointDown} from '../../../@core/utility/Utils';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {Body1} from '../../../@core/elements/common';

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
  '#008000',
  '#4B0082',
  '#90EE90',
  '#F1933D',
  '#FF7F7F',
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

const EmploymentWiseChart = () => {
  const {messages, formatNumber, locale} = useIntl();
  const [chartData, setChartData] = useState<any>([]);
  const {data: statisticsData} = useFetchDashboardEmploymentStatus();
  const minimumTextSize = useBreakPointDown('md') ? 9 : 15;

  useEffect(() => {
    const customOrder = [2, 4, 3, 1, null];
    chartData.sort(
      (a: any, b: any) =>
        customOrder.indexOf(a.employment_status) -
        customOrder.indexOf(b.employment_status),
    );
  }, [chartData]);

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
            <Typography>
              {data.title} {': '} {`${localizedNumbers(data.value, locale)}`}{' '}
              {messages['dashboard.number']}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const CustomLegend = ({payload}: any) => {
    return (
      <Box sx={{padding: '10px'}}>
        <Stack direction={'column'} gap={2}>
          {payload.map((entry: any, index: any) => (
            <Stack key={index} direction={'row'}>
              <Stack direction={'row'}>
                <FiberManualRecordIcon sx={{color: entry.color}} />
                <Body1>{`${entry.value}`}</Body1>
              </Stack>
              {/*<Body2*/}
              {/*  sx={{*/}
              {/*    marginLeft: '5px',*/}
              {/*    fontWeight: '700',*/}
              {/*  }}>{`${formatNumber(entry.payload.value)}`}</Body2>*/}
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  const RenderCustomizedLabel = useCallback(
    ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      // @ts-ignore
      const formattedPercent = formatNumber((percent * 100).toFixed(0));

      return (
        <text
          x={x}
          y={y}
          fill='white'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'>
          {formattedPercent} %
          {/*{chartData[index]?.title.length >= minimumTextSize*/}
          {/*  ? chartData[index]?.title.substring(0, minimumTextSize) + '...'*/}
          {/*  : chartData[index]?.title}*/}
        </text>
      );
    },
    [chartData, minimumTextSize],
  );

  return (
    <StyledBox>
      <Card>
        <CardHeader title={messages['course.employment_status']} />

        <CardContent>
          <ResponsiveContainer width={'100%'} height={380}>
            {chartData?.length > 0 ? (
              <PieChart width={350} height={350}>
                <Pie
                  data={chartData || []}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  paddingAngle={1}
                  dataKey='value'
                  nameKey={'title'}
                  fill='#2F80ED'
                  isAnimationActive={false}
                  labelLine={false}
                  label={RenderCustomizedLabel}>
                  {chartData.map((val: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout='vertical'
                  iconType={'square'}
                  align={'right'}
                  verticalAlign={'top'}
                  content={CustomLegend}
                  iconSize={4}
                />
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

export default EmploymentWiseChart;
