import React, {FC} from 'react';
import {Card, CardContent, Grid} from '@mui/material';
import ContentWithImageSkeleton from './ContentWithImageSkeleton';
import {H2} from '../../../../@core/elements/common';
import {styled} from '@mui/material/styles';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';

const PREFIX = 'ContentLayout';

const classes = {
  textStyle: `${PREFIX}-textStyle`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
}));

interface ContentLayoutProps {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  contentSkeleton?: React.ReactNode;
}

const ContentLayout: FC<ContentLayoutProps> = ({
  title,
  actions,
  contentSkeleton = <ContentWithImageSkeleton />,
  children,
  ...props
}) => {
  const result = useCustomStyle();

  return (
    <StyledCard>
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <H2
              tabIndex={0}
              sx={{
                ...result.h6,
              }}
              className={classes.textStyle}>
              {title}
            </H2>
          </Grid>
          {actions && (
            <Grid item xs={6} sx={{textAlign: 'right'}}>
              {actions}
            </Grid>
          )}
        </Grid>

        {props.isLoading ? contentSkeleton : children}
      </CardContent>
    </StyledCard>
  );
};

export default ContentLayout;
