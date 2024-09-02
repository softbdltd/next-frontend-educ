import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider} from '@mui/material';
import {AddCircle, CheckCircle} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';

const PREFIX = 'BasicInfoItemBox';

const classes = {
  displayInline: `${PREFIX}-displayInline`,
  divider: `${PREFIX}-divider`,
};

const StyledBox = styled(Box)(({theme}): any => ({
  paddingTop: 5,
  '& .itemIcon': {
    float: 'right',
    width: '1rem',
    height: '1rem',
  },

  [`& .${classes.displayInline}`]: {
    display: 'inline-block',
  },

  [`& .${classes.divider}`]: {
    width: 'calc(100% + 32px)',
    marginLeft: '-16px',
    height: 1,
    marginTop: 5,
  },
}));

interface BasicInfoItemBoxProps {
  learnerProfile: YouthAuthUser | null;
}

const BasicInfoItemBox = ({learnerProfile}: BasicInfoItemBoxProps) => {
  const {messages} = useIntl();

  return (
    <>
      <StyledBox>
        <Box className={classes.displayInline}>{messages['common.mobile']}</Box>
        {learnerProfile?.mobile ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
        <Divider className={classes.divider} />
      </StyledBox>
      <StyledBox>
        <Box className={classes.displayInline}>{messages['common.email']}</Box>
        {learnerProfile?.email ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
        <Divider className={classes.divider} />
      </StyledBox>
      <StyledBox>
        <Box className={classes.displayInline}>
          {messages['common.identity_number']}
        </Box>
        {learnerProfile?.identity_number ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
        <Divider className={classes.divider} />
      </StyledBox>
      <StyledBox>
        <Box className={classes.displayInline}>
          {messages['common.education']}
        </Box>
        {learnerProfile?.educations && learnerProfile?.educations.length ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
        <Divider className={classes.divider} />
      </StyledBox>
      <StyledBox>
        <Box className={classes.displayInline}>
          {messages['common.language']}
        </Box>
        {learnerProfile?.languages_proficiencies &&
        learnerProfile?.languages_proficiencies.length ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
        <Divider className={classes.divider} />
      </StyledBox>
      <StyledBox>
        <Box className={classes.displayInline}>
          {messages['portfolio.label']}
        </Box>
        {learnerProfile?.portfolios && learnerProfile?.portfolios.length ? (
          <CheckCircle className='itemIcon' color={'secondary'} />
        ) : (
          <AddCircle className='itemIcon' color={'primary'} />
        )}
      </StyledBox>
    </>
  );
};

export default BasicInfoItemBox;
