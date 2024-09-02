import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
// import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {Book} from '@mui/icons-material';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {API_ADMIN_BLOG_AND_SUCCESS_STORIES} from '../../../@core/common/apiRoutes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Link} from '../../../@core/elements/common';
import {LINK_DASHBOARD_BLOG_AND_SUCCESS_STORIES_DETAILS} from '../../../@core/common/appLinks';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import CustomChipStatus from '../memberList/CustomChipStatus';
import {styled} from '@mui/material/styles';
import BlogAndSuccessStoriesApprovePopup from './BlogAndSuccessStoriesApprovePopup';
import {Button} from '@mui/material';
import {Check} from '@mui/icons-material';

const StyledButton = styled(Button)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    ['&.show-icon']: {
      minWidth: 0,
      boxShadow: '0px 5px 6px rgb(155 155 155 / 42%)',
      ['& .MuiButton-startIcon']: {
        margin: 0,
      },
    },
  },
}));

const BlogAndSuccessStoriesPage = () => {
  const {messages, locale} = useIntl();
  // const {successStack, errorStack} = useNotiStack();
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const {blog_and_success_stories: blog_and_success_stories_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const closeApproveModal = useCallback(() => {
    setIsOpenApproveModal(false);
    setSelectedItemId(null);
  }, []);

  const openApproveModal = useCallback((itemId: number | null = null) => {
    setIsOpenApproveModal(true);
    setSelectedItemId(itemId);
  }, []);

  // const ApproveBlog = async (blogId: number) => {
  //   try {
  //     let response = await ApproveBlogAndStories(blogId);
  //     if (isResponseSuccess(response)) {
  //       successStack(
  //         <IntlMessages
  //           id='common.subject_approved'
  //           values={{
  //             subject: <IntlMessages id='blog_and_success_stories.label' />,
  //           }}
  //         />,
  //       );
  //       refreshDataTable();
  //     }
  //   } catch (error) {
  //     errorStack(<IntlMessages id={'message.somethingWentWrong'} />);
  //   }
  // };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_ADMIN_BLOG_AND_SUCCESS_STORIES,
  });

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        filterable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.full_name'] as string,
        field: 'full_name',
        width: 250,
        filterable: true,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 200,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <CustomChipStatus variant={'filled'} value={data?.row_status} />
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {blog_and_success_stories_permissions.canRead && (
                <Link
                  href={`${LINK_DASHBOARD_BLOG_AND_SUCCESS_STORIES_DETAILS}${data.id}`}
                  passHref>
                  <ReadButton />
                </Link>
              )}
              {blog_and_success_stories_permissions.canUpdate && (
                <StyledButton
                  color={'success'}
                  onClick={() => openApproveModal(data)}
                  startIcon={<Check sx={{color: 'green'}} />}>
                  <IntlMessages id={'common.approve'} />
                </StyledButton>
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <Book /> <IntlMessages id='blog_and_success_stories.label' />
          </>
        }>
        <DataTable
          columns={columns}
          fetchData={onFetchData}
          data={data}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
        />
        {isOpenApproveModal && (
          <BlogAndSuccessStoriesApprovePopup
            key={1}
            onClose={closeApproveModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default BlogAndSuccessStoriesPage;
