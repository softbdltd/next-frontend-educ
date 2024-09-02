import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import {useRouter} from 'next/router';
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
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {LINK_APPLICATION_MANAGEMENT} from '../../../@core/common/appLinks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchDashboardMostDemandableCourse} from '../../../services/global/hooks';
import {localizedNumbers} from '../../../@core/utilities/helpers';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Theme} from '@mui/system';

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

interface MostDemandableCourseChartProps {
  courseData?: Array<any>;
}

const MostDemandableCourseChart = ({
  courseData,
}: MostDemandableCourseChartProps) => {
  const {messages, locale} = useIntl();
  const router = useRouter();
  const authUser = useAuthUser<CommonAuthUser>();
  const barChartSize: number = 30;
  const barChartSpace: number = 20;
  const [demandableCourseFilter, setDemandableCourseFilter] =
    useState<any>(null);
  const {data: dashData} = useFetchDashboardMostDemandableCourse(
    demandableCourseFilter,
  );
  const [demandableCourse, setDemandableCourse] = useState<any>([]);

  const breakpointMDDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const heightNumber: number = demandableCourse
    ? demandableCourse.length * (barChartSize + barChartSpace)
    : 0;

  useEffect(() => {
    if (courseData) {
      let data: any = [];
      let len = breakpointMDDown ? 11 : 12;

      courseData.map((cData: any) => {
        if (cData.name.length > len) {
          cData.yAxisName = cData.name.substring(0, len) + '...';
          data.push(cData);
        } else {
          cData.yAxisName = cData.name;
          data.push(cData);
        }
      });
      setDemandableCourse(data);
    } else {
      setDemandableCourseFilter({});
    }
  }, [courseData, breakpointMDDown]);

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
              {`${localizedNumbers(data.value, locale)}`}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const handleClick = (evt: any) => {
    router
      .push({
        pathname: LINK_APPLICATION_MANAGEMENT,
        query: {course_id: evt.payload.course_id},
      })
      .then();
  };
  return (
    <StyledBox>
      <Card>
        <CardHeader
          title={
            courseData
              ? messages['dashboard.most_demandable_occupation']
              : messages['dashboard.MostDemandableCourse']
          }
        />
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
                <Bar
                  dataKey='value'
                  fill='#4B66F1'
                  onClick={!authUser?.isSystemUser ? handleClick : undefined}
                  cursor={'pointer'}
                />
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
