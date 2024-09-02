import {Box, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {H4, Link} from '../../../../@core/elements/common';
import {urlParamsUpdate} from '../../../../@core/utilities/helpers';
import PageSizes from '../../../../@core/utilities/PageSizes';
import {useFetchPublicFreelanceMarkets} from '../../../../services/cmsManagement/hooks';
import BoxCardsSkeleton from '../../../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../../../learner/common/NoDataFoundComponent';
import CustomPaginationWithPageNumber from '../../../learner/training/components/CustomPaginationWithPageNumber';
import AccessToMarketCard from './AccessToMarketCard';

const PREFIX = 'MarketSection';

export const classes = {
  subHeader: `${PREFIX}-subHeader`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.subHeader}`]: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

const MarketSection = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const [noticeOrNewsFilter, setNoticeOrNewsFilter] = useState<any>(null);

  const {
    data: marketList,
    metaData: marketListMetaData,
    isLoading: inLoadingMarketList,
  } = useFetchPublicFreelanceMarkets(noticeOrNewsFilter);

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
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  useEffect(() => {
    const filter: any = {
      ...router.query,
      page_size: router.query?.page_size || PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
    };

    setNoticeOrNewsFilter(filter);
  }, [router.query]);

  return (
    <Container maxWidth={'lg'}>
      <StyledGrid container spacing={3} mb={5}>
        <Grid item xs={6} sm={9} md={10}>
          <H4 className={classes.subHeader}>
            {messages['menu.freelance_market']}
          </H4>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={3}>
            {inLoadingMarketList ? (
              <Grid item xs={12}>
                <BoxCardsSkeleton />
              </Grid>
            ) : marketList && marketList.length ? (
              <>
                {marketList.map((item: any) => {
                  return (
                    <Grid item xs={12} sm={6} md={3} key={item?.id}>
                      {/*// @ts-ignore*/}
                      <Link href={item?.url} target={'_blank'}>
                        <AccessToMarketCard item={item} />
                      </Link>
                    </Grid>
                  );
                })}

                <Grid item xs={12}>
                  <CustomPaginationWithPageNumber
                    metaData={marketListMetaData}
                    pageInfo={noticeOrNewsFilter}
                    onPaginationChange={onPaginationChange}
                    rowsPerPage={Number(router.query.page_size)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Grid>
              </>
            ) : (
              <Box pt={'100px'}>
                <NoDataFoundComponent messageType={messages['common.market']} />
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledGrid>
    </Container>
  );
};

export default MarketSection;
