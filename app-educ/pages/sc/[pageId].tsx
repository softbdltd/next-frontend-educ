import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import asyncComponent from '../../../@core/utility/asyncComponent';

const StaticContent = asyncComponent(() => import('../../../modules/sc'));

export default EducFrontPage(() => {
  return (
    <>
      <StaticContent />
    </>
  );
});

// export async function getServerSideProps(context: any) {
//   const {
//     req: {cookies},
//   } = context;
//
//   const {pageId} = context.query;
//   const params = {
//     show_in: ShowInTypes.NICE3,
//   };
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
//     const res = await apiGet(API_PUBLIC_STATIC_PAGE_BLOCKS + pageId, {
//       params,
//       headers: {
//         Authorization: 'Bearer ' + appAccessToken,
//       },
//     });
//
//     return {props: {data: res?.data?.data}};
//   } catch (e) {
//     return {props: {data: null}};
//   }
// }
