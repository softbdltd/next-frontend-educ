import React from 'react';
import {Container, Grid} from '@mui/material';
import NursingProfileComponent from '../common/NursingProfileComponent';
import PersonalInfoSection from './personalInfo/PersonalInfoSection';
import JobExperienceSection from './jobExperiences/JobExperienceSection';
import EducationSection from './educations/EducationSection';
import CertificationSection from './certifications/CertificationSection';
import LanguageSection from './languages/LanguageSection';
import GuardianSection from './guardians/GuardianSection';
import ReferenceSection from './references/ReferenceSection';
import PortfolioSection from './portfolios/PortfolioSection';
import ProfileCompleteSignatureMenu from './ProfileCompleteSignatureMenu';
import FreelanceProfileComponent from '../common/FreelanceProfileComponent';
import MyCVSection from './MyCVSection';
import AddressSection from './address/addressSection';
import CareerInfoSection from './careerInfo/CareerInfoSection';

const YouthProfile = () => {
  return (
    <>
      <Container maxWidth={'lg'}>
        <Grid container columnSpacing={3} mt={{xs: 3}}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <PersonalInfoSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <CareerInfoSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <JobExperienceSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <EducationSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <CertificationSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <LanguageSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <ReferenceSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <PortfolioSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <GuardianSection />
              </Grid>
              <Grid item xs={12} md={12}>
                <AddressSection />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <ProfileCompleteSignatureMenu />
              </Grid>
              <Grid item xs={12} md={12}>
                <FreelanceProfileComponent />
              </Grid>
              <Grid item xs={12} md={12}>
                <NursingProfileComponent />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <MyCVSection />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default YouthProfile;
