import React from 'react';
import {Container} from '@mui/material';
import Resources from './Resources';
import BlogAndSuccessStories from './BlogAndSuccessStories';

const EntrepreneurshipPage = () => {
  return (
    <Container maxWidth={'lg'}>
      <BlogAndSuccessStories />
      <Resources />
    </Container>
  );
};

export default EntrepreneurshipPage;