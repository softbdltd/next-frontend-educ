import React, {SyntheticEvent, useState} from 'react';
import {styled} from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Container, Grid, Skeleton} from '@mui/material';
import {useIntl} from 'react-intl';
import {H1} from '../../../@core/elements/common';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import RowStatus from '../../../@core/utilities/RowStatus';
import {useFetchPublicFAQ} from '../../../services/cmsManagement/hooks';

const PREFIX = 'InstituteFAQ';

const classes = {
  accordion: `${PREFIX}-accordion`,
  heading: `${PREFIX}-heading`,
  iconStyle: `${PREFIX}-iconStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => {
  return {
    [`& .${classes.accordion}`]: {
      marginBottom: '10px',
    },
    [`& .${classes.heading}`]: {
      boxShadow: '0px 2px 2px #8888',
    },
    [`& .${classes.iconStyle}`]: {
      color: theme.palette.grey[800],
      fontSize: '1.875rem',
    },
  };
});

const InstituteFAQ = () => {
  const [expandedState, setExpanded] = useState<string | false>(false);
  const {messages} = useIntl();

  const [faqFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const {data: faqItems, isLoading: isLoadingFaq} =
    useFetchPublicFAQ(faqFilters);

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <StyledGrid sx={{maxWidth: '100%'}}>
      <Grid textAlign={'center'} className={classes.heading}>
        <H1 py={3} fontWeight={'bold'} style={{fontSize: '2.5rem'}}>
          {messages['faq.institute']}
        </H1>
      </Grid>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid item xs={12} my={4}>
            {isLoadingFaq ? (
              <>
                <Skeleton
                  variant={'rectangular'}
                  height={40}
                  width={1150}
                  style={{marginBottom: '10px'}}
                />
                <Skeleton
                  variant={'rectangular'}
                  height={40}
                  width={1150}
                  style={{marginBottom: '10px'}}
                />
                <Skeleton
                  variant={'rectangular'}
                  height={40}
                  width={1150}
                  style={{marginBottom: '10px'}}
                />
              </>
            ) : faqItems && faqItems.length > 0 ? (
              faqItems?.map((item: any) => (
                <Accordion
                  className={classes.accordion}
                  expanded={expandedState === item.id}
                  onChange={handleChange(item.id)}
                  key={item.id}>
                  <AccordionSummary
                    expandIcon={
                      expandedState === item.id ? (
                        <RemoveIcon className={classes.iconStyle} />
                      ) : (
                        <AddIcon className={classes.iconStyle} />
                      )
                    }
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'>
                    <Typography
                      sx={{
                        width: '100%',
                        color: expandedState == item.id ? 'primary.main' : '',
                      }}>
                      {item?.question ||
                        'No Question has been added in English language'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {item?.answer ||
                        'No Answer has been added in English language'}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <NoDataFoundComponent />
            )}
          </Grid>
        </Grid>
      </Container>
    </StyledGrid>
  );
};

export default InstituteFAQ;
