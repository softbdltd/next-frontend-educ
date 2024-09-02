import React, {FC, useCallback, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button} from '@mui/material';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {useIntl} from 'react-intl';
import {H3, Link} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import {LINK_FRONTEND_JOB_DETAILS} from '../../../../@core/common/appLinks';
import CustomChip from '../../../../@core/elements/display/CustomChip/CustomChip';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useRouter} from 'next/router';
import JobApplyPopup from '../../../../@core/components/JobApplyPopup';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';
import {AccessorType} from '../../../../shared/constants/AccessorType';

const PREFIX = 'RecentJobComponent';

const classes = {
  jobProviderImage: `${PREFIX}-jobProviderImage`,
  jobTitle: `${PREFIX}-jobTitle`,
  jobProviderName: `${PREFIX}-jobProviderName`,
  detailsButton: `${PREFIX}-detailsButton`,
};

const StyledBox = styled(Box)(({theme}) => ({
  padding: '5px 10px 0px 20px',

  [`& .${classes.jobProviderImage}`]: {
    height: 45,
    width: 45,
    border: '1px solid ' + theme.palette.grey['300'],
    '& img': {
      objectFit: 'contain',
    },
  },

  [`& .${classes.jobTitle}`]: {
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.jobProviderName}`]: {
    color: theme.palette.grey['600'],
    marginBottom: 10,
  },
  [`& .${classes.detailsButton}`]: {
    boxShadow: 'none',
    marginLeft: 10,
  },
}));

interface RecentJobProps {
  data: any;
  onCloseJobApplyPopup?: () => void;
}

const RecentJobComponent: FC<RecentJobProps> = ({
  data,
  onCloseJobApplyPopup,
}) => {
  const {messages} = useIntl();
  const result = useCustomStyle();
  const authUser = useAuthUser<YouthAuthUser>();
  const router = useRouter();
  const [isOpenJobApplyModal, setIsOpenJobApplyModal] = useState(false);

  const closeJobApplyModal = useCallback(() => {
    setIsOpenJobApplyModal(false);
    if (onCloseJobApplyPopup) {
      onCloseJobApplyPopup();
    }
  }, []);

  const onJobApply = useCallback(
    (isApplyOnline: any) => {
      if (Number(isApplyOnline) == 1) {
        setIsOpenJobApplyModal(true);
      } else {
        router
          .push(`${LINK_FRONTEND_JOB_DETAILS}${data?.job_id}`)
          .then(() => {});
      }
    },
    [data],
  );

  const getJobProviderTitle = () => {
    if (data?.primary_job_information?.is_job_post_for_other == 1) {
      return data?.primary_job_information?.other_name;
    } else {
      if (data?.accessor_type == AccessorType.INDUSTRY_ASSOCIATION) {
        return data?.industry_association_title;
      } else if (data?.accessor_type == AccessorType.ORGANIZATION) {
        return data?.organization_title;
      } else {
        return '';
      }
    }
  };

  const getCompanyAddress = () => {
    let address: string = '';

    if (data?.primary_job_information?.is_job_post_for_other == 1) {
      address = data?.primary_job_information?.other_address;
    } else {
      if (data?.accessor_type == AccessorType.INDUSTRY_ASSOCIATION) {
        address = data?.industry_association_address;
      } else if (data?.accessor_type == AccessorType.ORGANIZATION) {
        address = data?.organization_address;
      } else {
        address = '';
      }
    }
    return address ?? '';
  };

  return (
    <StyledBox sx={{display: 'flex', flexWrap: 'wrap'}}>
      <Box sx={{flex: '1 45px'}}>
        <AvatarImageView
          alt='provider image'
          variant={'square'}
          src={data?.industry_association_logo}
          className={classes.jobProviderImage}
        />
      </Box>
      <Box marginLeft={'10px'} sx={{flex: '1 calc(100% - 60px)'}}>
        <H3 sx={{...result.body2}} className={classes.jobTitle}>
          {data?.job_title}
        </H3>
        <Box className={classes.jobProviderName}>
          {getJobProviderTitle()} {getCompanyAddress()}
        </Box>
      </Box>
      <Box sx={{flex: '1 auto'}}>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Link passHref href={`${LINK_FRONTEND_JOB_DETAILS}${data.job_id}`}>
            <Button variant='outlined' color='primary' size={'small'}>
              {messages['common.details']}
            </Button>
          </Link>
          {(!authUser || authUser?.isYouthUser) &&
            (data?.has_applied == '1' ? (
              <CustomChip
                label={messages['common.applied']}
                color={'primary'}
                sx={{
                  marginLeft: '15px',
                  borderRadius: '5px',
                  height: '35px',
                }}
              />
            ) : (
              <Button
                variant={'contained'}
                color={'primary'}
                size={'small'}
                sx={{marginLeft: '15px'}}
                onClick={() => onJobApply(data?.is_apply_online)}>
                {messages['common.apply_now']}
              </Button>
            ))}
        </Box>
      </Box>
      {isOpenJobApplyModal && (
        <JobApplyPopup job={data} onClose={closeJobApplyModal} />
      )}
    </StyledBox>
  );
};

export default RecentJobComponent;
