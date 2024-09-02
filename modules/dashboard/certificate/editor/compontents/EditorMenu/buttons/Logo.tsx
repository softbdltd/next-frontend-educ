import React from 'react';
import ExternalLink from './../../ui/ExternalLink';
interface Props {
  className?: string;
}

function Logo({className}: Props) {
  return (
    <ExternalLink className='logo' to='/' newTab>
      <img src='/logo-medium.png' alt='' />
    </ExternalLink>
  );
}

export default Logo;
