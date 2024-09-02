import Router, {useRouter} from 'next/router';
import {styled} from '@mui/material/styles';
import CVTemplateKeys from '../../learner/myCv/CVTemplateKeys';
import {useIntl} from 'react-intl';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ClassicTemplate from '../../learner/myCv/templates/ClassicTemplate';
import ModernTemplate from '../../learner/myCv/templates/ModernTemplate';
import {Box, Button, Container, Grid, Typography} from '@mui/material';
import {useFetchYouthDetails} from '../../../services/learnerManagement/hooks';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PREFIX = 'YouthCVPage';

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
// const PRINT_WIDTH = 1000;
// const PRINT_HIGHT = 1400;
const YouthCVPage = () => {
  const router: any = useRouter();
  // const {messages, locale} = useIntl();
  const {messages} = useIntl();
  const {learnerId} = router.query;
  const [params] = useState({show_in_cv: 1});
  const {data: learnerData} = useFetchYouthDetails(learnerId, params);

  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(
    CVTemplateKeys.CLASSIC,
  );

  useEffect(() => {
    if (learnerData) {
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
      case CVTemplateKeys.UPLOADED_CV:
        return (
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Box
              sx={{
                height: {xs: '620px', lg: '1038px'},
                width: '80%',
              }}>
              <object
                width='100%'
                height='100%'
                data={`${process.env.NEXT_PUBLIC_FILE_SERVER_FILE_VIEW_ENDPOINT}${learnerData?.cv_path}`}
                type='application/pdf'>
                {' '}
              </object>
            </Box>
          </Box>
        );
      default:
        return <ClassicTemplate userData={learnerData} />;
    }
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={5}>
        <Grid item xs={6} sm={6} md={6}>
          <Typography variant={'h5'} fontWeight={'bold'}>
            {messages['common.learner_cv']}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={3} md={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant='outlined'
            onClick={() => Router.back()}
            style={{float: 'right'}}>
            {messages['common.back']}
          </Button>
        </Grid>
        {selectedTemplateKey !== CVTemplateKeys.UPLOADED_CV && (
          <Grid item xs={3} sm={3} md={3}>
            <Button
              variant='contained'
              onClick={printCB}
              style={{float: 'right'}}>
              {messages['common.print']}
            </Button>
          </Grid>
        )}

        {/* <Grid item xs={4} sm={2} md={2}>
          <Button
            variant='contained'
            onClick={downloadCB}
            style={{float: 'right'}}>
            {messages['common.download']}
          </Button>
          <a id="lnk" download>Download</a>
        </Grid> */}
      </Grid>

      <Grid container spacing={5} className={classes.rootContent}>
        <Grid item xs={12} sm={12} md={12} ref={refer}>
          {learnerData && getTemplate()}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default YouthCVPage;
