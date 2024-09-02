import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
} from '@mui/material';
import NoticeCard from './NoticeCard';
import SearchIcon from '@mui/icons-material/Search';
import {useIntl} from 'react-intl';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import {useFetchPublicNoticeOrNewses} from '../../../services/cmsManagement/hooks';
import NoticeOrNewsTypes from '../../../@core/utilities/NoticeOrNewsTypes';
import {objectFilter} from '../../../@core/utilities/helpers';
import {H1} from '../../../@core/elements/common';
import PageSizes from '../../../@core/utilities/PageSizes';
import KeyCodes from '../../../@core/utilities/KeyCodes';
import CustomPaginationWithPageNumber from '../training/components/CustomPaginationWithPageNumber';
import {useRouter} from 'next/router';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';

const PREFIX = 'YouthNoticeBoard';

const classes = {
  noticeBoardText: `${PREFIX}-noticeBoardText`,
  paperSearch: `${PREFIX}-paperSearch`,
  noticeTopBox: `${PREFIX}-noticeTopBox`,
  paginationBox: `${PREFIX}-paginationBox`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  padding: 20,
  [`& .${classes.noticeBoardText}`]: {
    fontWeight: 'bold',
    fontSize: '1.421875rem',
    color: theme.palette.primary.main,
  },

  [`& .${classes.paperSearch}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.noticeTopBox}`]: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },

  [`& .${classes.paginationBox}`]: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const urlParamsUpdate = (router: any, params: any) => {
  router.push(
    {
      pathname: router.pathname,
      query: params,
    },
    undefined,
    {shallow: true},
  );
};

const YouthNoticeBoardV1 = () => {
  const {messages} = useIntl();
  const searchFieldRef = useRef<any>();
  const authUser = useAuthUser<YouthAuthUser>();
  const router = useRouter();

  const [pageInfo, setPageInfo] = useState<any>({
    page_size: PageSizes.EIGHT,
    page: 1,
  });
  const {
    data: noticeList,
    isLoading: isNoticeLoading,
    metaData,
  } = useFetchPublicNoticeOrNewses(pageInfo);

  useEffect(() => {
    setPageInfo({
      ...router.query,
      type: NoticeOrNewsTypes.NOTICE,
      page_size: router.query?.page_size
        ? Number(router.query?.page_size)
        : PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
    });
  }, [authUser]);

  useEffect(() => {
    setPageInfo({
      ...router.query,
      page_size: router.query?.page_size
        ? Number(router.query?.page_size)
        : PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
      search_text: (router.query?.search_text as string) ?? '',
    });
  }, [router.query]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isNoticeLoading !== false) return;
    const {type: _, ...others} = router.query;
    if (Object.keys(others).length > 0 && noticeList?.length === 0) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: 1,
          },
        },
        undefined,
        {shallow: true},
      );
    }
  }, [noticeList]);

  const onSearchClick = useCallback((e) => {
    if (e.keyCode && e.keyCode !== KeyCodes.ENTER) {
      return false;
    }
    setPageInfo((params: any) => {
      return objectFilter({
        ...params,
        ...{search_text: searchFieldRef.current?.value},
      });
    });

    urlParamsUpdate(router, {
      ...router.query,
      search_text: searchFieldRef.current?.value,
    });
  }, []);

  const onPaginationChange = useCallback(
    (event: any, currentPage: number) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: currentPage ?? 1,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageInfo((prev: any) => ({
        ...prev,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      }));
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  return (
    <StyledContainer maxWidth={'lg'}>
      <Box className={classes.noticeTopBox}>
        <H1 className={classes.noticeBoardText}>
          {messages['common.notice_board']}
        </H1>
        <Box>
          <Paper className={classes.paperSearch}>
            <InputBase
              sx={{ml: 1, flex: 1, paddingLeft: '20px'}}
              placeholder={messages['common.search'] as string}
              inputProps={{'aria-label': 'Search'}}
              inputRef={searchFieldRef}
              onKeyDown={onSearchClick}
            />
            <IconButton
              sx={{p: '10px'}}
              aria-label='search'
              onClick={onSearchClick}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      {isNoticeLoading ? (
        <Grid container spacing={2} mt={2}>
          <Grid
            item
            xs={12}
            style={{display: 'flex', justifyContent: 'space-around'}}>
            <Skeleton variant='rectangular' width={'35%'} height={126} />
            <Skeleton variant='rectangular' width={'35%'} height={126} />
          </Grid>
        </Grid>
      ) : noticeList && noticeList.length ? (
        <Grid container spacing={3} style={{marginTop: 0}}>
          {noticeList.map((notice: any) => {
            return (
              <Grid item xs={12} md={6} key={notice.id}>
                <NoticeCard notice={notice} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <NoDataFoundComponent messageTextType={'h4'} />
      )}

      <CustomPaginationWithPageNumber
        metaData={metaData}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
        rowsPerPage={Number(router.query.page_size)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledContainer>
  );
};

export default YouthNoticeBoardV1;
