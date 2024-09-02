import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {localizedNumbers} from '../../../@core/utilities/helpers';
import {useFetchDashboardPopularInstitute} from '../../../services/global/hooks';
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

const PopularInstituteChart = () => {
  const {messages, locale} = useIntl();

  const barChartSize: number = 30;
  const barChartSpace: number = 20;
  const [demandableCourseFilter] = useState<any>({});
  const {data: dashData} = useFetchDashboardPopularInstitute(
    demandableCourseFilter,
  );
  const [demandableCourse, setDemandableCourse] = useState<any>([]);

  const heightNumber: number = demandableCourse
    ? demandableCourse.length * (barChartSize + barChartSpace)
    : 0;

  useEffect(() => {
    if (dashData) {
      let courseData: any = [];
      dashData.map((data: any) => {
        if (data.institute_name.length > 10) {
          data.yAxisName = data.institute_name.substring(0, 10) + '...';
          courseData.push(data);
        } else {
          data.yAxisName = data.institute_name;
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
            <Typography>{`${data.institute_name}`}</Typography>
            <Typography>
              {messages['dashboard.TotalEnrolments']}:{' '}
              {`${localizedNumbers(data.value, locale)}`}
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
        <CardHeader title={messages['dashboard.popular_institutes']} />
        <CardContent
          sx={{
            padding: 0,
          }}>
          <ResponsiveContainer width={'100%'} height={516}>
            {demandableCourse?.length > 0 ? (
              <BarChart
                margin={{
                  top: 0,
                  right: 15,
                  left: 0,
                  bottom: 0,
                }}
                width={420}
                height={heightNumber == 0 ? 250 : heightNumber - 30}
                barSize={barChartSize}
                data={demandableCourse}
                layout={'vertical'}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis width={120} type='category' dataKey='yAxisName' />
                <Tooltip content={<CustomTooltip />} />
                {/*<Legend />*/}
                <Bar dataKey='value' fill='#4B66F1' cursor={'pointer'} />
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

export default PopularInstituteChart;
