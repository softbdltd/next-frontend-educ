import Script from 'next/script';
import asyncComponent from '../../@core/utility/asyncComponent';
import EducFrontPage from '../../@core/layouts/hoc/EducFrontPage';
import PageMeta from '../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';

const Home = asyncComponent(() => import('../../modules/home'));

export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-D0SSQK5HPG'></Script>
      <Script id={'google-analytics-educ'}>
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "G-D0SSQK5HPG");`}
      </Script>

      <PageMeta title={messages['educ.title_description']} />
      <Home />
    </>
  );
});
