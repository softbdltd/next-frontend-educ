import {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Card, CardContent, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {H1, H2} from '../../../@core/elements/common';
import RoomIcon from '@mui/icons-material/Room';
import GoogleMapReact from 'google-map-react';
import {
  useFetchPublicInstituteDetails,
  useFetchPublicTrainingCenters,
} from '../../../services/instituteManagement/hooks';
import {
  EMAIL_REGEX,
  MOBILE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import {createVisitorFeedback} from '../../../services/cmsManagement/VisitorFeedbackService';
import {VisitorFeedbackTypes} from '../../../services/cmsManagement/Constants';
import {ThemeMode} from '../../../shared/constants/AppEnums';
import {GOOGLE_MAP_API_KEY} from '../../../@core/common/constants';
import {
  isValidLatitude,
  isValidLongitude,
} from '../../../@core/utilities/helpers';

const PREFIX = 'InstituteContact';

const classes = {
  buttons: `${PREFIX}-buttons`,
  mainGrid: `${PREFIX}-mainGrid`,
  heading: `${PREFIX}-heading`,
  formCard: `${PREFIX}-formCard`,
  mapDiv: `${PREFIX}-mapDiv`,
  textStyle: `${PREFIX}-textStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => {
  return {
    [`& .${classes.buttons}`]: {
      width: '100%',
    },
    [`& .${classes.mainGrid}`]: {
      background: theme.palette.primary.main,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    [`& .${classes.heading}`]: {
      boxShadow: '0px 2px 2px #8888',
    },
    [`& .${classes.formCard}`]: {
      [theme.breakpoints.up('md')]: {
        height: '505px',
      },
    },
    [`& .${classes.mapDiv}`]: {
      height: '320px',
      width: '100%',
    },
    [`& .${classes.textStyle}`]: {
      color:
        theme.palette.mode === ThemeMode.DARK
          ? theme.palette.common.white
          : theme.palette.common.black,
      fontSize: '1.375rem',
    },
  };
});

type MapProp = {
  text: string;
  lat: number;
  lng: number;
};

const MapComponent = ({text}: MapProp) => (
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
    }}>
    <RoomIcon htmlColor={'#e80808'} />
    {text}
  </div>
);

const InstituteContact = () => {
  const {messages} = useIntl();
  const {data: institute} = useFetchPublicInstituteDetails();
  const {successStack, errorStack} = useNotiStack();

  const [trainingCenterFilters] = useState<any>({});
  const {data: trainingCenters} = useFetchPublicTrainingCenters(
    trainingCenterFilters,
  );

  const [mapCenter, setMapCenter] = useState({
    lat: 23.776488939377593,
    lng: 90.38155009066672,
  });

  const [mapLocations, setMapLocations] = useState([]);

  useEffect(() => {
    if (trainingCenters && trainingCenters.length > 0) {
      let locations: any = [];
      trainingCenters.map((tc: any) => {
        if (
          isValidLatitude(tc?.location_latitude) &&
          isValidLongitude(tc?.location_longitude)
        ) {
          locations.push({
            title: tc.title,
            lat: tc.location_latitude,
            lng: tc.location_longitude,
          });
        }
      });
      setMapLocations(locations);
    }
  }, [trainingCenters]);

  const onChangeMapValue = (trainingCenterId: any) => {
    let filterData = trainingCenters?.filter(
      (item: any) => item.id == trainingCenterId,
    );

    if (filterData.length > 0) {
      if (
        isValidLatitude(filterData[0]?.location_latitude) &&
        isValidLongitude(filterData[0]?.location_longitude)
      ) {
        setMapCenter({
          lat: parseFloat(filterData[0].location_latitude),
          lng: parseFloat(filterData[0].location_longitude),
        });
      }
    }
  };

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      recipient: yup.string().label(messages['recipient.institute'] as string),
      name: yup
        .string()
        .required()
        .label(messages['common.name'] as string),
      mobile: yup
        .string()
        .required()
        .label(messages['common.phone_number'] as string)
        .matches(MOBILE_NUMBER_REGEX),
      email: yup
        .mixed()
        .label(messages['common.email'] as string)
        .test(
          'email_validation',
          messages['common.validation_email_error'] as string,
          (value) => !value || Boolean(value.match(EMAIL_REGEX)),
        ),

      comment: yup
        .string()
        .required()
        .label(messages['advice.institute'] as string),
    });
  }, [messages]);

  const {
    // register,
    handleSubmit,
    setError,
    control,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    data.form_type = VisitorFeedbackTypes.CONTACTUS;

    try {
      await createVisitorFeedback(data);
      successStack(
        <IntlMessages
          id='common.subject_sent_successfully'
          values={{subject: <IntlMessages id='common.your_info' />}}
        />,
      );
      reset();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <StyledGrid sx={{maxWidth: '100%'}}>
      <Grid textAlign={'center'} className={classes.heading}>
        <H1 py={3} style={{fontSize: '2.25rem', fontWeight: 'bold'}}>
          {messages['contact.institute']}
        </H1>
      </Grid>
      <Grid sx={{maxWidth: '100%'}} className={classes.mainGrid}>
        <Grid
          maxWidth='lg'
          container
          sx={{margin: 'auto'}}
          justifyContent={'center'}
          py={2}>
          <Grid item md={6} xs={12} p={2}>
            <Card>
              <CardContent className={classes.formCard}>
                <Grid>
                  <H2 mb={4} className={classes.textStyle}>
                    {messages['contact_with_us.institute']}
                  </H2>
                </Grid>
                <Grid>
                  <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
                    <Grid container spacing={5}>
                      {!institute?.id && (
                        <Grid item xs={12}>
                          <CustomFormSelect
                            id='recipient'
                            label={messages['recipient.institute']}
                            isLoading={false}
                            control={control}
                            optionValueProp={'id'}
                          />
                        </Grid>
                      )}

                      <Grid item xs={6}>
                        <CustomTextInput
                          required
                          id='name'
                          label={messages['common.name']}
                          control={control}
                          errorInstance={errors}
                          isLoading={false}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomTextInput
                          required
                          id='mobile'
                          label={messages['common.phone_number']}
                          control={control}
                          errorInstance={errors}
                          isLoading={false}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextInput
                          id='email'
                          label={messages['common.email']}
                          control={control}
                          errorInstance={errors}
                          isLoading={false}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextInput
                          required
                          id='comment'
                          label={messages['advice.institute']}
                          control={control}
                          errorInstance={errors}
                          isLoading={false}
                          multiline={true}
                          rows={3}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        justifyContent={'center'}
                        mt={3}
                        style={{paddingTop: '0'}}>
                        <Button
                          type={'submit'}
                          disabled={isSubmitting}
                          className={classes.buttons}
                          variant='contained'>
                          {messages['common.send']}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={6} xs={12} p={2}>
            <Card>
              <CardContent>
                <H2 mb={4} className={classes.textStyle}>
                  {messages['find_our_location_in_map.institute']}
                </H2>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <CustomFormSelect
                      id='title'
                      label={messages['common.location']}
                      isLoading={false}
                      control={control}
                      optionValueProp={'id'}
                      options={trainingCenters}
                      optionTitleProp={['title']}
                      onChange={onChangeMapValue}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.mapDiv}>
                      <GoogleMapReact
                        bootstrapURLKeys={{key: GOOGLE_MAP_API_KEY}}
                        center={mapCenter}
                        zoom={11}>
                        {mapLocations?.map((item: any, i: number) => (
                          <MapComponent
                            key={i}
                            lat={item.lat}
                            lng={item.lng}
                            text={item.title}
                          />
                        ))}
                      </GoogleMapReact>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </StyledGrid>
  );
};

export default InstituteContact;
