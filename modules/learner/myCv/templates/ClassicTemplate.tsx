import {Box} from '@mui/material';
import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {getD3ValueByPage} from '../../../../@core/common/classic-svg-d3-util';
import ClassicCvPage from './ClassicCvPage';

interface ClassicTemplateProps {
  userData: any;
}

const ClassicTemplate: FC<ClassicTemplateProps> = ({userData}) => {
  const {messages, locale, formatDate, formatNumber} = useIntl();
  const generateD3Value = getD3ValueByPage(
    userData,
    messages,
    locale,
    formatDate,
    formatNumber,
  );

  // console.log('generateD3Value', generateD3Value, userData);

  return (
    <>
      {generateD3Value?.map((item: any, index: any) => {
        return (
          <React.Fragment key={index}>
            <ClassicCvPage
              userData={userData}
              pageIndex={index}
              pageUserData={item}
              formatNumber={formatNumber}
            />
            <Box sx={{height: '20px'}} />
          </React.Fragment>
        );
      })}
    </>
  );
};
export default ClassicTemplate;
