import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import clsx from 'clsx';
import ColorfulTemplate from './templates/ColorfulTemplate';
import CVTemplateKeys from './CVTemplateKeys';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchYouthDetails} from '../../../services/learnerManagement/hooks';
import {updateYouthDefaultCVTemplate} from '../../../services/learnerManagement/YouthService';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';

const PREFIX = 'MyCVPage';

const classes = {
  rootContent: `${PREFIX}-rootContent`,
  templateImage: `${PREFIX}-templateImage`,
  templateSelected: `${PREFIX}-templateSelected`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: 20,
  marginBottom: 20,
  [`& .${classes.rootContent}`]: {
    marginTop: 0,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row-reverse',
    },
  },

  [`& .${classes.templateImage}`]: {
    cursor: 'pointer',
  },

  [`& .${classes.templateSelected}`]: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
  },
}));

const MyCVPage = () => {
  const userData = useAuthUser<YouthAuthUser>();
  const learnerId = userData?.learnerId;
  const [params] = useState({show_in_cv: 1});
  const {data: learnerData} = useFetchYouthDetails(String(learnerId), params);
  const [defaultTemplate, setDefaultTemplate] = useState('');
  const [resumeTemplates, setResumeTemplates] = useState<any>([]);

  const {updateSuccessMessage} = useSuccessMessage();

  const {messages} = useIntl();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(
    CVTemplateKeys.CLASSIC,
  );

  const onTemplateSelect = useCallback((key: string) => {
    setSelectedTemplateKey(key);
  }, []);

  useEffect(() => {
    let resumeTemplatesArr = [
      {
        key: CVTemplateKeys.CLASSIC,
        name: 'Classic',
        demoImage: '/images/learner/classic_cv_image.png',
      },
      {
        key: CVTemplateKeys.MODERN,
        name: 'Modern',
        demoImage: '/images/learner/modern_cv_image.png',
      },
    ];

    if (learnerData?.cv_path) {
      resumeTemplatesArr.push({
        key: CVTemplateKeys.UPLOADED_CV,
        name: 'Uploaded Cv',
        demoImage: '/images/learner/classic_cv_image.png',
      });
    }

    setResumeTemplates(resumeTemplatesArr);

    if (learnerData) {
      setDefaultTemplate(learnerData?.default_cv_template);
      setSelectedTemplateKey(learnerData?.default_cv_template);
    }
  }, [learnerData]);

  const refer = useRef(null);
  const printCB = useCallback(() => {
    if (refer && refer.current) {
    } else return;

    // @ts-ignore
    const svgs: any = refer.current.querySelectorAll('svg');

    if (svgs) {
      let html: any = null;
      svgs?.forEach((svg: any) => {
        if (!html) html = svg.outerHTML;
        else html += svg.outerHTML;
      });

      const frameName = 'printIframe';
      // @ts-ignore
      let doc: any = window.frames[frameName];
      if (!doc) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('name', frameName);
        iframe.setAttribute('frameborder', '0');
        iframe.style.opacity = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.bottom = '0';
        iframe.style.position = 'fixed';
        iframe.style.pointerEvents = 'none';
        document.body.appendChild(iframe);
        // @ts-ignore
        doc = window.frames[frameName];
      }
      doc.document.body.innerHTML = `<div style='margin: 5px'>${html}</div>`;
      doc.window.print();
    }
  }, []);

  const getTemplate = () => {
    switch (selectedTemplateKey) {
      case CVTemplateKeys.CLASSIC:
        return <ClassicTemplate userData={learnerData} />;
      case CVTemplateKeys.MODERN:
        return <ModernTemplate userData={learnerData} />;
      case CVTemplateKeys.COLORFUL:
        return <ColorfulTemplate userData={userData} />;
      case CVTemplateKeys.UPLOADED_CV:
        return (
          <Box
            sx={{
              height: {xs: '620px', lg: '1030px'},
              width: '100%',
            }}>
            <object
              width='100%'
              height='100%'
              data={`${process.env.NEXT_PUBLIC_FILE_SERVER_FILE_VIEW_ENDPOINT}${learnerData?.cv_path}`}
              type='application/pdf'>
              {' '}
            </object>
          </Box>
        );
      default:
        return <ClassicTemplate userData={learnerData} />;
    }
  };

  const handleChange = async (event: any) => {
    setDefaultTemplate(event.target.value);
    const data = {default_cv_template: event.target.value};
    setSelectedTemplateKey(event.target.value);
    try {
      await updateYouthDefaultCVTemplate(data);
      updateSuccessMessage('cv_view.default_cv_template');
    } catch (error: any) {
      console.log('updateYouthDefaultCVTemplate error: ', error);
    }
  };

  const getTemplateName = (key: string) => {
    switch (key) {
      case CVTemplateKeys.MODERN:
        return messages['customizer.modern'];
      case CVTemplateKeys.UPLOADED_CV:
        return messages['customizer.uploaded_cv'];
      default:
        return messages['customizer.classic'];
    }
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={5}>
        <Grid item xs={10} sm={10} md={6}>
          <h3 style={{fontSize: '1.421875rem', margin: 0, fontWeight: 'bold'}}>
            {messages['common.my_cv']}
          </h3>
        </Grid>
        {selectedTemplateKey !== CVTemplateKeys.UPLOADED_CV && (
          <Grid item xs={2} sm={2} md={2}>
            <Button
              variant='contained'
              size={'small'}
              onClick={printCB}
              style={{float: 'right'}}>
              {messages['common.print_download']}
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={5} className={classes.rootContent}>
        <Grid item xs={12} sm={12} md={4}>
          <Typography variant={'h6'} fontWeight={'bold'}>
            {messages['cv_view.template_title']}
          </Typography>
          <Grid container spacing={5}>
            {resumeTemplates.map((template: any, index: number) => {
              // console.log('template.name', template.name);
              return (
                <Grid item xs={4} key={index} sx={{textAlign: 'center'}}>
                  <CardMedia
                    component={'img'}
                    image={template.demoImage}
                    className={clsx(
                      classes.templateImage,
                      selectedTemplateKey == template.key
                        ? classes.templateSelected
                        : '',
                    )}
                    onClick={() => {
                      onTemplateSelect(template.key);
                    }}
                  />
                  <Typography>{getTemplateName(template?.key)}</Typography>
                </Grid>
              );
            })}
          </Grid>
          <FormControl sx={{marginTop: 5}}>
            <FormLabel id='demo-controlled-radio-buttons-group'>
              {messages['cv_view.set_default_cv_template']}
            </FormLabel>
            <RadioGroup
              aria-labelledby='set_default_cv_template'
              name='set_default_cv_template'
              value={defaultTemplate}
              onChange={handleChange}>
              <FormControlLabel
                value='CLASSIC'
                control={<Radio />}
                label={messages['customizer.classic'] as string}
              />
              <FormControlLabel
                value='MODERN'
                control={<Radio />}
                label={messages['customizer.modern'] as string}
              />
              {learnerData?.cv_path && (
                <FormControlLabel
                  value='UPLOADED_CV'
                  control={<Radio />}
                  label={messages['customizer.uploaded_cv'] as string}
                />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={8} ref={refer}>
          {learnerData && getTemplate()}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default MyCVPage;
