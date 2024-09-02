import {Box, Card, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import CustomCarousel from '../../@core/elements/display/CustomCarousel/CustomCarousel';
import React, {useState} from 'react';
import {Link} from '../../@core/elements/common';
import {useIntl} from 'react-intl';
import {useFetchPublicPartners} from '../../services/cmsManagement/hooks';
import SectionTitle from './SectionTitle';
import BoxCardsSkeleton from '../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';

const PREFIX = 'Partners';

const classes = {
  vBar: `${PREFIX}-vBar`,
  cardItem: `${PREFIX}-courseItem`,
  image: `${PREFIX}-image`,
  imageAlt: `${PREFIX}-imageAlt`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  marginTop: '60px',

  [`& .${classes.cardItem}`]: {
    position: 'relative',
    /*boxShadow: '2px 8px 7px #ddd',*/
    /*border: '1px solid #ddd',*/
    display: 'flex',
    justifyContent: 'center',
    height: '135px',
  },

  [`& .${classes.image}`]: {
    width: '100%',
    height: '100%',
  },
  [`& .${classes.imageAlt}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  '& .react-multi-carousel-list': {
    padding: '20px 0px',
  },
}));

const Partners = () => {
  const {messages} = useIntl();
  const [partnerFilters] = useState({});
  const {data: partners, isLoading: isLoadingPartners} =
    useFetchPublicPartners(partnerFilters);
  const cardItem = (partner: any, key: number) => {
    return partner?.domain ? (
      <Link href={partner?.domain} target='_blank' passHref key={key}>
        <Box mr={1} ml={1}>
          <Card className={classes.cardItem}>
            <Box className={classes.imageAlt}>
              <img
                className={classes.image}
                src={
                  partner?.main_image_path
                    ? partner?.main_image_path
                    : '/images/blank_image.png'
                }
                alt={
                  partner?.image_alt_title
                    ? partner?.image_alt_title
                    : partner?.title
                }
                title={partner?.title}
              />
            </Box>
          </Card>
        </Box>
      </Link>
    ) : (
      <Box mr={1} ml={1} key={key}>
        <Card className={classes.cardItem}>
          <Box className={classes.imageAlt}>
            <img
              className={classes.image}
              src={
                partner?.main_image_path
                  ? partner?.main_image_path
                  : '/images/blank_image.png'
              }
              alt={
                partner?.image_alt_title
                  ? partner?.image_alt_title
                  : partner?.title
              }
              title={partner?.title}
            />
          </Box>
        </Card>
      </Box>
    );
  };
  return (
    <StyledGrid container xl={12}>
      <Container maxWidth='lg'>
        <SectionTitle
          title={messages['educ.partners'] as string}
          center={true}
        />
        <Box mb={2} sx={{marginTop: '-16px'}}>
          {isLoadingPartners ? (
            <BoxCardsSkeleton />
          ) : partners && partners.length > 0 ? (
            <CustomCarousel>
              {partners.map((partner: any, key: number) =>
                cardItem(partner, key),
              )}
            </CustomCarousel>
          ) : (
            <NoDataFoundComponent messageTextType={'h6'} />
          )}
        </Box>
      </Container>
    </StyledGrid>
  );
};

export default Partners;
