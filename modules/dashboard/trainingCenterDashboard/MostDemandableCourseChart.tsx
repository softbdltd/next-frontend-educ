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
import {localizedNumbers} from '../../../@core/utilities/helpers';
import {useFetchTrainingCenterDashboardMostDemandableCourse} from '../../../services/instituteManagement/hooks';
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

const MostDemandableCourseChart = () => {
  const {messages, locale} = useIntl();

  const barChartSize: number = 30;
  const {data: dashData} =
    useFetchTrainingCenterDashboardMostDemandableCourse();
  const [demandableCourse, setDemandableCourse] = useState<any>([]);

  useEffect(() => {
    if (dashData) {
      let courseData: any = [];
      dashData.map((data: any) => {
        if (data.name.length > 10) {
          data.yAxisName = data.name.substring(0, 10) + '...';
          courseData.push(data);
        } else {
          data.yAxisName = data.name;
          courseData.push(data);
        }
      });
      setDemandableCourse(courseData);
    }
  }, [dashData]);

  const CustomTooltip = ({payload, active}: any) => {
    if (active && payload && payload.length) {
      const {payload: data} = payload[0];
      return (
        <Card>
          <CardContent>
            <Typography>{`${data.name}`}</Typography>
            <Typography>
              {messages['dashboard.TotalEnrolments']}:{' '}
              {`${localizedNumbers(data.enrollments, locale)}`}
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
        <CardHeader title={messages['dashboard.MostDemandableCourse']} />
        <CardContent>
          <ResponsiveContainer width={'100%'} height={440}>
            {demandableCourse?.length > 0 ? (
              <BarChart
                width={420}
                height={440}
                barSize={barChartSize}
                data={demandableCourse}
                layout={'vertical'}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis width={100} type='category' dataKey='yAxisName' />
                <Tooltip content={<CustomTooltip />} />
                {/*<Legend />*/}
                <Bar dataKey='enrollments' fill='#4B66F1' />
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

export default MostDemandableCourseChart;
