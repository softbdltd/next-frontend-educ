import React, {useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Button,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useIntl} from 'react-intl';
import Hidden from '../../@core/elements/Hidden';
import {useRouter} from 'next/router';
import RowStatus from '../../@core/utilities/RowStatus';
import {useFetchLocalizedDistricts} from '../../services/locationManagement/hooks';
import {
  LINK_FRONTEND_JOBS,
  LINK_FRONTEND_EDUC_SKILLS,
} from '../../@core/common/appLinks';
import useNotiStack from '../../@core/hooks/useNotifyStack';
import CustomFilterableSelect from '../learner/training/components/CustomFilterableSelect';
import clsx from 'clsx';

const PREFIX = 'SearchBox';

const classes = {
  select: `${PREFIX}-select`,
  topSelect: `${PREFIX}-topSelect`,
  resetDivider: `${PREFIX}-resetDivider`,
  rootPaper: `${PREFIX}-rootPaper`,
  searchButton: `${PREFIX}-searchButton`,
  inputLabel: `${PREFIX}-inputLabel`,
  inputLabelBackground: `${PREFIX}-inputLabelBackground`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
  [`& .${classes.select}`]: {
    color: '#818086',
    '&>div, &>div:focus': {
      backgroundColor: 'transparent',
    },
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },

  [`& .${classes.topSelect}`]: {
    border: '1px solid #671688',
    background: theme.palette.primary.main,
    textAlign: 'center',
    color: '#fff',
    height: 40,
    width: 110,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '& .MuiSelect-select': {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.primary.main,
    },
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '&>div, &>div:focus': {
      backgroundColor: 'transparent',
    },
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },

  [`& .${classes.inputLabel}`]: {
    top: '-6px',
    color: theme.palette.common.white,
    '&.Mui-focused': {
      color: theme.palette.common.white,
      background: theme.palette.primary.main,
      padding: '1px 5px',
    },
  },
  [`& .${classes.inputLabelBackground}`]: {
    background: theme.palette.primary.main,
    padding: '1px 5px',
  },

  [`& .${classes.resetDivider}`]: {
    marginTop: '0px !important',
    marginBottom: '0px !important',
  },

  [`&.${classes.rootPaper}`]: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '760px',
    height: '86px',
    padding: '10px',
    marginTop: '50px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      width: '100%',
    },
  },

  [`& .${classes.searchButton}`]: {
    borderRadius: 0,
    width: '150px',
    height: '100%',
    marginLeft: '20px',
    [theme.breakpoints.down('md')]: {
      width: '80px',
    },
  },
}));

const SearchBox = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const [districtFilter] = useState({row_status: RowStatus.ACTIVE});
  const {data: districts} = useFetchLocalizedDistricts(districtFilter);
  const [locationValue, setLocationValue] = useState<any>(null);
  const [typeValue, setTypeValue] = useState<any>('');
  const searchTextField = useRef<any>();
  const {errorStack} = useNotiStack();
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  const onSearchClick = () => {
    const text = searchTextField.current.value;
    let query;
    if (locationValue) {
      query = {
        district: locationValue,
      };
    }
    if (text) {
      if (typeValue == 1) {
        router
          .push({
            pathname: LINK_FRONTEND_EDUC_SKILLS,
            query: {
              ...query,
              search_text: searchTextField.current.value,
            },
          })
          .then(() => {});
      } else if (typeValue == 2) {
        router
          .push({
            pathname: LINK_FRONTEND_JOBS,
            query: {
              ...query,
              search_text: searchTextField.current.value,
            },
          })
          .then(() => {});
      } else {
        setIsOpenDropDown(true);
        errorStack(messages['common.select_first']);
      }
    }
  };

  return (
    <StyledPaper
      sx={{zIndex: '999'}}
      elevation={0}
      square
      // @ts-ignore
      component='form'
      className={classes.rootPaper}>
      <FormControl
        sx={{
          position: 'absolute',
          left: 0,
          top: '-40px',
          color: 'primary.contrastText',
        }}>
        <InputLabel
          id='type-select-label'
          aria-hidden={true}
          className={
            typeValue
              ? clsx(classes.inputLabel, classes.inputLabelBackground)
              : classes.inputLabel
          }>
          {messages['common.select']}
        </InputLabel>

        <Select
          className={classes.topSelect}
          variant='filled'
          open={isOpenDropDown}
          value={typeValue}
          labelId={'type-select-label'}
          label={messages['common.select']}
          MenuProps={{disableScrollLock: true}}
          defaultValue={typeValue}
          onClick={() => {
            setIsOpenDropDown((prevState) => !prevState);
          }}
          onChange={(e: any) => {
            setTypeValue(e.target.value);
          }}>
          <MenuItem value='1' tabIndex={0}>
            {messages['menu.training']}
          </MenuItem>
          <Divider className={classes.resetDivider} />
          <MenuItem value='2' tabIndex={0}>
            {messages['menu.jobs']}
          </MenuItem>
          {/*<Divider className={classes.resetDivider} />
        <MenuItem value='3'>{messages['common.business']}</MenuItem>
        <Divider className={classes.resetDivider} />
        <MenuItem value='4'>{messages['common.educations']}</MenuItem>*/}
        </Select>
      </FormControl>
      <Hidden mdDown>
        <SearchIcon sx={{p: '20px'}} aria-label='Search icon' tabIndex={0} />
      </Hidden>
      <InputBase
        sx={{ml: 1, flex: 1}}
        placeholder={messages['common.search_2'] as string}
        inputProps={{'aria-label': 'অনুসন্ধান করুন'}}
        inputRef={searchTextField}
      />
      <Hidden mdDown>
        <Paper component='span' elevation={0} sx={{minWidth: '200px'}}>
          <CustomFilterableSelect
            id={'loc_upazila_id'}
            defaultValue={locationValue}
            label={messages['common.location_2'] as string}
            onChange={(upazilaId: any) => {
              setLocationValue(upazilaId);
            }}
            options={districts}
            isLoading={false}
            optionValueProp={'id'}
            placeholder={messages['common.location_2'] as string}
            optionTitleProp={['title']}
            size='medium'
            dropdownStyle={{
              width: '400px',
            }}
          />
        </Paper>
      </Hidden>
      <Button
        variant='contained'
        size={'large'}
        className={classes.searchButton}
        disableElevation
        onClick={onSearchClick}>
        {messages['common.search']}
      </Button>
    </StyledPaper>
  );
};
export default SearchBox;
