import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import PageMeta from '../../../@core/core/PageMeta';
import asyncComponent from '../../../@core/utility/asyncComponent';
import {useIntl} from 'react-intl';
import {useContext} from 'react';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const RecentActivitiesDetails = asyncComponent(
  () =>
    import(
      '../../../modules/institute/recent-activities/RecentActivitiesDetails'
    ),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.recent_activities']}
      />
      <RecentActivitiesDetails />
    </>
  );
});

// export default InstituteDefaultFrontPage(({data}: any) => {
//   return (
//     <>
//       <PageMeta title={data?.title} />
//       <RecentActivitiesDetails data={data} />
//     </>
//   );
// });

// export async function getServerSideProps(context: any) {
//   const {
//     req: {cookies},
//   } = context;
//
//   let id = context.params.details;
//
//   try {
//     let appAccessToken = JSON.parse(
//       cookies?.app_access_token || '{}',
//     )?.access_token;
//
//     if (!appAccessToken) {
//       const response = await getAppAccessToken();
//       appAccessToken = response?.data?.access_token;
//     }
//
//     const res = await apiGet(API_PUBLIC_RECENT_ACTIVITIES + `/${id}`, {
//       headers: {Authorization: 'Bearer ' + appAccessToken},
//     });
//
//     return {props: {data: res?.data?.data}};
//   } catch (e) {
//     //console.log('err=>', e);
//     return {props: {data: null}};
//   }
// }
