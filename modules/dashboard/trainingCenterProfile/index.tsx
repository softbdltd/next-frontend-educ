import {Grid, Skeleton} from '@mui/material';
import React from 'react';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {H4} from '../../../@core/elements/common';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useFetchTrainingCenterProfile} from '../../../services/instituteManagement/hooks';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';
import BankInfoDetailsView from '../Institutes/BankInfoDetailsView';

const PREFIX = 'trainingProfile';

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
  },
  [`& .${classes.form}`]: {
    background: theme.palette.common.white,
    borderRadius: '7px',
    padding: '40px',
  },
  [`& .${classes.divider}`]: {
    width: '100%',
  },
}));

const TrainingCenterProfile = () => {
  const {messages} = useIntl();

  const {data: profileData, isLoading: isLoadingUserData} =
    useFetchTrainingCenterProfile();

  return (
    <>
      <StyledGrid container>
        {isLoadingUserData ? (
          <Skeleton variant='rectangular' width={'100%'} height={340} />
        ) : (
          <Grid item xs={12} sm={7} md={7}>
            <Grid container className={classes.form} spacing={3}>
              <Grid item xs={12}>
                <H4>{messages['common.training_center_information']}</H4>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.training_center_bn']}
                  value={profileData?.title}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.training_center_en']}
                  value={profileData?.title_bn}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.institute_name']}
                  value={profileData?.institute_title}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.institute_name_en']}
                  value={profileData?.institute_title_en}
                  isLoading={false}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <AddressDetailsView
                    itemData={profileData}
                    isLoading={false}
                  />
                </Grid>
              </Grid>
              {/*bank info readview*/}
              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <BankInfoDetailsView
                    itemData={profileData?.training_center_payment_account_info}
                    isLoading={isLoadingUserData}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomChipRowStatus
                  label={messages['common.active_status']}
                  value={profileData?.row_status}
                  isLoading={false}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </StyledGrid>
    </>
  );
};

export default TrainingCenterProfile;
