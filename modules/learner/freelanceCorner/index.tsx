import React, {useCallback, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import {Search} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import AllFreelancerListSection from './AllFreelancerListSection';
import {useFetchPublicSkills} from '../../../services/learnerManagement/hooks';
import {useFetchLocalizedUpazilas} from '../../../services/locationManagement/hooks';
import FreelanceProfileComponent from '../common/FreelanceProfileComponent';
import NearbySkilledYouthSection from './NearbySkilledYouthSection';
import CustomFilterableSelect from '../training/components/CustomFilterableSelect';

const PREFIX = 'FreelanceCorner';

const classes = {
  container: `${PREFIX}-container`,
  root: `${PREFIX}-root`,
  searchButton: `${PREFIX}-searchButton`,
  searchInputBorderHide: `${PREFIX}-searchInputBorderHide`,
  selectStyle: `${PREFIX}-selectStyle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`&.${classes.container}`]: {
    marginTop: 20,
    marginBottom: 20,
  },

  [`& .${classes.root}`]: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      flexDirection: 'column',
    },
  },

  [`& .${classes.searchButton}`]: {
    color: '#fff',
    padding: '13px 14px',
    width: '100%',
    height: '100%',
  },

  [`& .${classes.searchInputBorderHide}`]: {
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '14px 0px',
    },
  },

  [`& .${classes.selectStyle}`]: {
    background: '#fff',
    '& .MuiSelect-select': {
      padding: '10px 30px 10px 15px',
    },
  },
}));

const FreelanceCorner = () => {
  const {messages} = useIntl();

  const [selectedSkills, setSelectedSkills] = useState<Array<number>>([]);
  const [freelancerFilters, setFreelancerFilters] = useState<Array<number>>([]);
  const [searchInputText, setSearchInputText] = useState<string>('');
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<any>(null);
  const [skillFilters] = useState<any>({});
  const searchTextField = useRef<any>();

  const {data: skills} = useFetchPublicSkills(skillFilters);
  const [upazilaFilters] = useState<any>({});
  const {data: upazilas} = useFetchLocalizedUpazilas(upazilaFilters);

  const handleSearchAction = useCallback(() => {
    setSearchInputText(searchTextField.current?.value);
  }, []);

  const handleUpazilaChange = useCallback((upazilaId: number | null) => {
    setSelectedUpazilaId(upazilaId);
  }, []);

  const handleToggle = useCallback(
    (value: number) => () => {
      const currentIndex = selectedSkills.indexOf(value);
      const newChecked = [...selectedSkills];

      if (currentIndex < 0) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setSelectedSkills(newChecked);
      setFreelancerFilters(newChecked);
    },
    [selectedSkills],
  );

  return (
    <StyledContainer maxWidth={'lg'} className={classes.container}>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} md={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      marginBottom: 2,
                    }}>
                    {messages['freelance_corner.filterByLocation']}
                  </Box>

                  <CustomFilterableSelect
                    id={'upazila_id'}
                    defaultValue={selectedUpazilaId}
                    label={messages['freelance_corner.add_location'] as string}
                    onChange={handleUpazilaChange}
                    options={upazilas || []}
                    isLoading={false}
                    optionValueProp={'id'}
                    optionTitleProp={['title']}
                  />
                  <Box sx={{fontWeight: 'bold', marginTop: 4}}>
                    {messages['freelance_corner.filter_title']}
                  </Box>
                  <List
                    sx={{
                      width: '100%',
                      padding: '0px',
                    }}>
                    {skills &&
                      skills.map((item: any) => {
                        const labelId = `checkbox-list-label-${item.id}`;

                        return (
                          <ListItem key={item.id} disablePadding>
                            <ListItemButton
                              onClick={handleToggle(item.id)}
                              dense>
                              <ListItemIcon sx={{minWidth: '20px'}}>
                                <Checkbox
                                  edge='start'
                                  checked={selectedSkills.includes(item.id)}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{'aria-labelledby': labelId}}
                                  sx={{paddingTop: 0, paddingBottom: 0}}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={item.title} />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{padding: '10px', alignItems: 'center'}}>
                <Grid container spacing={1} sx={{alignItems: 'center'}}>
                  <Grid item xs={8} sm={9}>
                    <TextField
                      onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                          handleSearchAction();
                          ev.preventDefault();
                        }
                      }}
                      inputRef={searchTextField}
                      variant='outlined'
                      name='searchBox'
                      placeholder={messages['common.searchHere'] as string}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Search />
                          </InputAdornment>
                        ),
                        className: classes.searchInputBorderHide,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Button
                      variant='contained'
                      color={'primary'}
                      onClick={handleSearchAction}
                      className={classes.searchButton}>
                      {messages['common.search']}
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            {/*<Grid item xs={12}> //TODO it will be implemented in future
              <FeaturedFreelanceSection />
            </Grid>*/}
            <Grid item xs={12}>
              <AllFreelancerListSection
                skillIds={freelancerFilters}
                searchText={searchInputText}
                upazila_id={selectedUpazilaId}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FreelanceProfileComponent />
            </Grid>
            <Grid item xs={12}>
              <NearbySkilledYouthSection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default FreelanceCorner;
