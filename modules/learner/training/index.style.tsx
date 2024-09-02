import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';

const PREFIX = 'CustomFilterableSelect';

export const classes = {
  trainingViewRoot: `${PREFIX}-trainingViewRoot`,
  mainContent: `${PREFIX}-mainContent`,
  pageRootHeader: `${PREFIX}-pageRootHeader`,
  searchBox: `${PREFIX}-searchBox`,
  searchButton: `${PREFIX}-searchButton`,
  thinSearchButton: `${PREFIX}-thinSearchButton`,
  searchInputBorderHide: `${PREFIX}-searchInputBorderHide`,
  selectStyle: `${PREFIX}-selectStyle`,
  sectionTitle: `${PREFIX}-sectionTitle`,
  trainingCardRoot: `${PREFIX}-trainingCardRoot`,
  trainingCardImage: `${PREFIX}-trainingCardImage`,
  providerLogo: `${PREFIX}-providerLogo`,
  tagBox: `${PREFIX}-tagBox`,
  addressTextStyle: `${PREFIX}-addressTextStyle`,
};

export const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.trainingViewRoot}`]: {
    margin: '0px auto 20px',
  },

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },

  [`& .${classes.pageRootHeader}`]: {
    background: theme.palette.primary.main,
    color: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
  },

  [`& .${classes.searchBox}`]: {
    padding: '10px',
    alignItems: 'center',
    marginTop: 10,
  },

  [`& .${classes.searchButton}`]: {
    color: '#fff',
    padding: '16px 14px',
    width: '100%',
    height: '100%',
  },

  [`& .${classes.thinSearchButton}`]: {
    color: '#fff',
    padding: '11px 0',
    width: '97%',
    height: '100%',
  },

  [`& .${classes.searchInputBorderHide}`]: {
    padding: 0,
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      display: 'flex',
      alignItems: 'center',
      // padding: '14px 0px',
    },
  },

  [`& .${classes.selectStyle}`]: {
    background: '#fff',
    borderRadius: '5px',
    '& .MuiSelect-select': {
      padding: '10px 30px 10px 15px',
    },
  },

  [`& .${classes.sectionTitle}`]: {
    fontWeight: 'bold',
  },

  [`& .${classes.trainingCardRoot}`]: {
    maxWidth: 345,
    minWidth: '100%',
    position: 'relative',
  },

  [`& .${classes.trainingCardImage}`]: {
    height: 140,
  },

  [`& .${classes.providerLogo}`]: {
    height: 55,
    width: 55,
    border: '1px solid ' + theme.palette.grey['300'],
    position: 'absolute',
    top: 110,
    left: 10,
  },

  [`& .${classes.tagBox}`]: {
    marginTop: 15,
  },

  [`& .${classes.addressTextStyle}`]: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
  },
}));
