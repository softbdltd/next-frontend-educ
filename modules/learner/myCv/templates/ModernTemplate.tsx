import {Box} from '@mui/material';
import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {getD3ValueByPage} from '../../../../@core/common/modern-svg-d3-util';
import ModernCvPage from './ModernCvPage';

interface ModernTemplateProps {
  userData: any;
}

const ModernTemplate: FC<ModernTemplateProps> = ({userData}) => {
  const {messages, locale, formatDate, formatNumber} = useIntl();
  const generateD3Value = getD3ValueByPage(
    userData,
    messages,
    locale,
    formatDate,
    formatNumber,
  );

  return (
    <>
      {generateD3Value?.map((item: any, index: any) => {
        return (
          <React.Fragment key={index}>
            <ModernCvPage
              userData={userData}
              pageIndex={index}
              pageUserData={item}
              formatNumber={formatNumber}
            />
            <Box sx={{height: '20px'}}></Box>
          </React.Fragment>
        );
      })}
    </>
  );
};
export default ModernTemplate;
