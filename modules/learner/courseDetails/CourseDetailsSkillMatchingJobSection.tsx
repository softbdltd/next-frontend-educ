import React, {useEffect, useState} from 'react';
import {Button, Container, Grid} from '@mui/material';
import {ChevronRight} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import {H2} from '../../../@core/elements/common';
import {useFetchSkillMatchingPublicJobs} from '../../../services/IndustryManagement/hooks';
import JobCardComponent from '../../../@core/elements/JobCardComponent';
import BoxContentSkeleton from '../profile/component/BoxContentSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import PageSizes from '../../../@core/utilities/PageSizes';
import Link from 'next/link';
import {LINK_FRONTEND_COURSE_SKILL_MATCHING_JOBS} from '../../../@core/common/appLinks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';

interface CourseDetailsSkillMatchingJobSectionProps {
  skillIds: Array<number>;
  courseId: any;
}

const CourseDetailsSkillMatchingJobSection = ({
  skillIds,
  courseId,
}: CourseDetailsSkillMatchingJobSectionProps) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();

  const [jobFilters, setJobFilters] = useState<any>(null);

  useEffect(() => {
    if (skillIds?.length > 0) {
      let params: any = {
        skill_ids: skillIds,
        page_size: PageSizes.FOUR,
        learner_id: authUser?.learnerId,
      };
      setJobFilters(params);
    }
  }, [authUser, skillIds]);

  const {data: jobs, isLoading} = useFetchSkillMatchingPublicJobs(jobFilters);

  return (
    <Container maxWidth={'lg'} style={{marginBottom: '5px'}}>
      <Grid container spacing={5} mt={'10px'}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container alignItems={'center'}>
            <Grid item xs={8} sm={9} md={10}>
              <H2 style={{fontWeight: 'bold', fontSize: '1.421875rem'}}>
                {messages['common.skill_matching_job']}
              </H2>
            </Grid>
            {jobs?.total_page > 1 && (
              <Grid item xs={4} sm={3} md={2} style={{textAlign: 'right'}}>
                <Link
                  href={`${LINK_FRONTEND_COURSE_SKILL_MATCHING_JOBS}${courseId}`}
                  passHref>
                  <Button
                    variant={'outlined'}
                    size={'medium'}
                    color={'primary'}>
                    {messages['common.see_all']}
                    <ChevronRight />
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {isLoading ? (
            <BoxContentSkeleton />
          ) : jobs && jobs.length > 0 ? (
            <Grid container spacing={5}>
              {jobs.map((job: any) => {
                return (
                  <Grid item xs={12} sm={4} md={3} key={job.id}>
                    <JobCardComponent job={job} isGridView={true} />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <NoDataFoundComponent
              message={messages['job.job_information_will_be_added'] as string}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetailsSkillMatchingJobSection;
