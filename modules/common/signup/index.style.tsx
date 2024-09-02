import {styled} from '@mui/material/styles';
import {Container} from '@mui/material';
import {SECONDARY_APP_HEADER_HEIGHT} from '../../@core/common/constants';

const PREFIX = 'YouthSignupPage';

export const classes = {
  paperBox: `${PREFIX}-paperBox`,
  iconBoxYouth: `${PREFIX}-iconBoxYouth`,
  iconBoxTc: `${PREFIX}-iconBoxTc`,
  iconBoxIndustry: `${PREFIX}-iconBoxIndustry`,
  icon: `${PREFIX}-icon`,
  text: `${PREFIX}-text`,
  signInStyle: `${PREFIX}-signInStyle`,
  iconBoxIndustryAssociation: `${PREFIX}-iconBoxInstitute`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

export const StyledContainer = styled(Container)(({theme}) => ({
  height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
  [`& .${classes.paperBox}`]: {
    margin: 'auto',
    padding: '20px',
  },

  [`& .${classes.iconBoxYouth}`]: {
    background: '#0069bc',
  },

  [`& .${classes.iconBoxTc}`]: {
    background: '#661686',
  },

  [`& .${classes.iconBoxIndustry}`]: {
    background: '#e67f22',
  },

  [`& .${classes.iconBoxIndustryAssociation}`]: {
    background: '#228b10',
  },

  [`& .${classes.icon}`]: {
    display: 'flex',
    flexDirection: 'column',
    // padding: '35px',
    alignItems: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    height: '8.75rem',
    width: '8.75rem',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      // padding: '20px',
      margin: 'auto',
      height: '6.25rem',
      width: '6.25rem',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },

  [`& .${classes.text}`]: {
    color: theme.palette.grey['300'],
    // whiteSpace: 'nowrap',
    textAlign: 'center',
    marginTop: '10px',
  },

  [`& .${classes.signInStyle}`]: {
    color: theme.palette.primary.main + ' !important',
    textDecoration: 'underline !important',
  },
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));
