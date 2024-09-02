import Script from 'next/script';
import asyncComponent from '../../@core/utility/asyncComponent';
import InstituteDefaultFrontPage from '../../@core/layouts/hoc/InstituteDefaultFrontPage';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import PageMeta from '../../@core/core/PageMeta';
import {DomainDetailsContext} from '../../@core/contexts/domain';

const Institute = asyncComponent(() => import('../../modules/institute'));

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);

  return (
    <>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-JTJ6481RZZ'></Script>
      <Script id='google-analytics-dyd'>
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "G-JTJ6481RZZ");`}
      </Script>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.first_page'] as string}
      />
      <Institute />
    </>
  );
});
