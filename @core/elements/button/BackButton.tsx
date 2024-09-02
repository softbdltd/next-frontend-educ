import Link from 'next/link';
import {Button} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import React from 'react';
import {useIntl} from 'react-intl';

interface BackButtonProps {
  url: string;
}
const BackButton = ({url}: BackButtonProps) => {
  const {messages} = useIntl();

  return (
    <Link href={url} passHref>
      <Button
        variant={'outlined'}
        startIcon={<ArrowBack />}
        sx={{marginRight: '10px'}}>
        {messages['common.back']}
      </Button>
    </Link>
  );
};
export default BackButton;
