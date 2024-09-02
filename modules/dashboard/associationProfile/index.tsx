import {Button, Divider, Grid, Skeleton, Typography} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import React, {useCallback, useContext, useState} from 'react';
import {useIntl} from 'react-intl';
import {H4, H6} from '../../../@core/elements/common';
import {Call, Email} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import {RiEditBoxFill} from 'react-icons/ri';
import AssociationProfileEditPopup from './AssociationProfileEditPopup';
import {useFetchIndustryAssocProfile} from '../../../services/IndustryAssociationManagement/hooks';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import AvatarImageView from '../../../@core/elements/display/ImageView/AvatarImageView';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';

const PREFIX = 'AssociationProfile';

const classes = {
  card: `${PREFIX}-card`,
  form: `${PREFIX}-form`,
  contact_person_avatar: `${PREFIX}-contact_person_avatar`,
  divider: `${PREFIX}-divider`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  marginTop: '20px',
  marginBottom: '20px',
  justifyContent: 'space-around',

  [`& .${classes.contact_person_avatar}`]: {
    width: '100px',
    height: '100px',
    boxShadow: '0px 0px 5px 2px #e9e9e9',
    marginTop: '10px',
    [`& img`]: {
      objectFit: 'unset',
    },
  },
  [`& .${classes.card}`]: {
    background: theme.palette.common.white,
    border: '1px solid #e9e9e9',
    borderRadius: '7px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px',
    },
  },
  [`& .${classes.form}`]: {
    background: theme.palette.common.white,
    border: '1px solid #e9e9e9',
    borderRadius: '7px',
    padding: '40px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px',
    },
  },
  [`& .${classes.divider}`]: {
    width: '100%',
  },
}));

const AssociationProfile = () => {
  const {messages, locale} = useIntl();
  const {industry_association: associationPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const {
    data: userData,
    isLoading: isLoadingUserData,
    mutate: mutateAssociation,
  } = useFetchIndustryAssocProfile();

  const [closeEditModal, setCloseEditModal] = useState<boolean>(true);

  const onClickCloseEditModal = useCallback(() => {
    setCloseEditModal((previousToggle) => !previousToggle);
    mutateAssociation();
  }, []);

  return (
    <>
      <StyledGrid container spacing={{xs: 3, sm: 2, md: 0}}>
        {isLoadingUserData ? (
          <>
            <Grid item xs={12} sm={4} md={4}>
              <Skeleton variant='rectangular' width={'100%'} height={340} />
            </Grid>
            <Grid item xs={12} sm={8} md={7}>
              <Skeleton variant='rectangular' width={'100%'} height={340} />
            </Grid>
          </>
        ) : (
          <React.Fragment>
            <Grid item xs={12} sm={4} md={4}>
              <Grid
                container
                className={classes.card}
                spacing={{xs: 0, sm: 3, md: 3}}
                sx={{
                  ['& .MuiGrid-item']: {
                    xs: {paddingBottom: '12px'},
                  },
                }}>
                <Grid
                  item
                  xs={12}
                  padding={1}
                  display={'flex'}
                  alignItems={'center'}
                  flexDirection={'column'}>
                  <AvatarImageView
                    className={classes.contact_person_avatar}
                    src={userData?.logo}
                  />
                  <H6 fontWeight={'bold'} mt={1}>
                    {userData?.title}
                  </H6>
                  <Typography variant={'subtitle2'}>
                    {userData?.industry_association_trade_title}
                  </Typography>
                </Grid>
                <Divider
                  orientation={'horizontal'}
                  className={classes.divider}
                />
                <Grid
                  item
                  xs={12}
                  sx={{padding: '8px 0 8px 30px'}}
                  display={'flex'}
                  alignItems={'center'}>
                  <Email sx={{color: '#F0B501'}} />
                  <Typography sx={{marginLeft: '10px'}} variant={'subtitle2'}>
                    {userData?.email}
                  </Typography>
                </Grid>
                <Divider
                  orientation={'horizontal'}
                  className={classes.divider}
                />
                <Grid
                  item
                  xs={12}
                  sx={{padding: '8px 0 8px 30px'}}
                  display={'flex'}
                  alignItems={'center'}>
                  <Call sx={{color: '#3FB0EF'}} />
                  <Typography sx={{marginLeft: '10px'}} variant={'subtitle2'}>
                    {userData?.mobile}
                  </Typography>
                </Grid>
                <Divider
                  orientation={'horizontal'}
                  className={classes.divider}
                />
                <Grid
                  item
                  xs={12}
                  padding={2}
                  mb={10}
                  display={'flex'}
                  justifyContent={'center'}>
                  {associationPermission.canUpdateProfile && (
                    <Button
                      onClick={onClickCloseEditModal}
                      sx={{borderRadius: '10px'}}
                      variant='outlined'
                      color='primary'
                      startIcon={<RiEditBoxFill />}>
                      {messages['learner_profile.edit_profile']}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8} md={7}>
              <Grid
                container
                className={classes.form}
                spacing={{xs: 0, sm: 3, md: 3}}
                sx={{
                  ['& .MuiGrid-item']: {
                    xs: {paddingBottom: '12px'},
                  },
                }}>
                <Grid item xs={12} sx={{textAlign: 'center'}}>
                  <H4>{messages['association.association_profile']}</H4>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['association.association_name']}
                    value={
                      locale === localeLanguage.BN
                        ? userData?.title
                        : userData?.title_en
                    }
                    isLoading={false}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['association.association_trades']}
                    value={userData?.trade_title}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={5}>
                    <AddressDetailsView itemData={userData} isLoading={false} />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_name']}
                    value={userData?.contact_person_name}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_name_en']}
                    value={userData?.contact_person_name_en}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_designation']}
                    value={userData?.contact_person_designation}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_designation_en']}
                    value={userData?.contact_person_designation_en}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_mobile']}
                    value={userData?.contact_person_mobile}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.contact_person_email']}
                    value={userData?.contact_person_email}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['institute.name_of_the_office_head']}
                    value={userData?.name_of_the_office_head}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['institute.name_of_the_office_head_en']}
                    value={userData?.name_of_the_office_head_en}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages['institute.name_of_the_office_head_designation']
                    }
                    value={userData?.name_of_the_office_head_designation}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages[
                        'institute.name_of_the_office_head_designation_en'
                      ]
                    }
                    value={userData?.name_of_the_office_head_designation_en}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.skills']}
                    value={(userData?.skills || [])
                      .map((data: any) => data.title)
                      .join(', ')}
                    isLoading={false}
                  />
                </Grid>
                {/*<Grid item xs={12} sm=6> md=6*/}
                {/*  <DetailsInputView*/}
                {/*    label={messages['common.domain']}*/}
                {/*    value={userData?.domain}*/}
                {/*    isLoading={false}*/}
                {/*  />*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.location_latitude']}
                    value={userData?.location_latitude}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.location_longitude']}
                    value={userData?.location_longitude}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <CustomChipRowStatus
                    label={messages['common.active_status']}
                    value={userData?.row_status}
                    isLoading={false}
                  />
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </StyledGrid>
      {!closeEditModal && (
        <AssociationProfileEditPopup
          userData={userData}
          onClose={onClickCloseEditModal}
        />
      )}
    </>
  );
};

export default AssociationProfile;
