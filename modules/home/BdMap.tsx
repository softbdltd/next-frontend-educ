import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, CardMedia, Container, Grid} from '@mui/material';
import SectionTitle from './SectionTitle';
import {useIntl} from 'react-intl';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const PREFIX = 'BdMap';

const classes = {
  mapButtonGroup: `${PREFIX}-mapButtonGroup`,
  skillButton: `${PREFIX}-skillButton`,
  map: `${PREFIX}-map`,
  mapSidePoints: `${PREFIX}-mapSidePoints`,
  mapIndicator: `${PREFIX}-mapIndicator`,
  tabListBox: `${PREFIX}-tabListBox`,
  TabPanelBox: `${PREFIX}-TabPanelBox`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: '40px',

  [`& .${classes.mapButtonGroup}`]: {
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
    marginBottom: '29px',
    width: '100%',
    maxWidth: '610px',
    marginTop: '0px',
  },

  [`& .${classes.skillButton}`]: {
    /*background: '#682988',
    color: '#fff',
    justifyContent: 'center',
    marginRight: '2px',
    minWidth: '98px',*/
  },

  [`& .${classes.map}`]: {
    border: '1px solid #eee',
    borderRadius: '2px',
    backgroundColor: theme.palette.grey[50],
  },

  [`& .${classes.mapSidePoints}`]: {
    borderRadius: '50%',
    height: '5px',
    width: '5px',
    marginTop: '5px',
    marginLeft: '5px',
  },
  [`& .${classes.mapIndicator}`]: {
    position: 'absolute',
    backgroundColor: theme.palette.common.white,
    right: '3px',
    bottom: '3px',
    width: '130px',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
    padding: '5px',
  },

  [`& .${classes.tabListBox}`]: {
    maxWidth: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  [`& .${classes.TabPanelBox}`]: {
    maxWidth: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '1px solid #eee',
    borderRadius: '2px',
    backgroundColor: theme.palette.grey[50],
    minHeight: '450px',
  },
}));

const BdMap = () => {
  const {messages} = useIntl();

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <StyledContainer maxWidth='lg'>
      <Grid container>
        <Grid item xs={12}>
          <SectionTitle
            title={messages['common.data_platform'] as string}
            center={true}
          />

          <Box
            sx={{
              width: '100%',
            }}>
            <TabContext value={value}>
              <Box className={classes.tabListBox}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'>
                  <Tab label={messages['common.skills']} value='1' />
                  <Tab label={messages['menu.jobs']} value='2' />
                  <Tab label={messages['common.business']} value='3' />
                  <Tab label={messages['common.educations']} value='4' />
                  <Tab label={messages['menu.jobs']} value='5' />
                </TabList>
              </Box>
              <Box className={classes.TabPanelBox}>
                <TabPanel value='1'>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Grid item xs={8}>
                      <CardMedia
                        component={'img'}
                        image={'images/map.png'}
                        title={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                        alt={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='2'>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Grid item xs={8}>
                      <CardMedia
                        component={'img'}
                        image={'images/map-districts.jpg'}
                        title={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                        alt={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='3'>
                  <Grid
                    container
                    xs={12}
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Grid item xs={8}>
                      <CardMedia
                        component={'img'}
                        image={'images/map.jpg'}
                        title={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                        alt={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='4'>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Grid item xs={8}>
                      <CardMedia
                        component={'img'}
                        image={'images/map.png'}
                        title={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                        alt={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='5'>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Grid item xs={8}>
                      <CardMedia
                        component={'img'}
                        image={'images/map.jpg'}
                        title={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                        alt={
                          messages['common.map_of_bangladesh'] as
                            | string
                            | undefined
                        }
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};
export default BdMap;
