import {Card, CardContent, CardHeader} from '@mui/material';
import React from 'react';
import mapPath from '../../../public/images/map-districts.jpg';
import Image from 'next/image';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useIntl} from 'react-intl';

const StyledContainer = styled(Box)(({theme}) => ({
  [`& .MuiCardHeader-title`]: {
    fontSize: '1.4rem',
    color: '#000',
    fontWeight: 400
  }
}));

const BangladeshMap = () => {
  const {messages} = useIntl();
  return (
    <StyledContainer>
      <Card>
        <CardHeader title={messages['dashboard.Map']}/>
        {/*<H3 style={{fontSize: '1.4rem'}}>*/}
        {/*  Map*/}
        {/*</H3>*/}
        <CardContent>
          <Image src={mapPath} />
        </CardContent>
      </Card>
  </StyledContainer>
  )
};

export default BangladeshMap;