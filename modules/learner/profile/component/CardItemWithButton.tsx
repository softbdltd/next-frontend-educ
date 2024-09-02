import {Box, Button, Card, CardMedia, Link} from '@mui/material';
import {styled} from '@mui/material/styles';
import {BorderColor} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import React from 'react';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../../@core/common/apiRoutes';
import CustomConfirmationButton from './CustomConfirmationButton';

const PREFIX = 'CardItemWithButton';

const classes = {
  image: `${PREFIX}-image`,
  buttons: `${PREFIX}-buttons`,
  deleteButtons: `${PREFIX}-deleteButtons`,
  circularDeleteButton: `${PREFIX}-circularDeleteButton`,
  box: `${PREFIX}-box`,
  editButton: `${PREFIX}-editButton`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.image}`]: {
    width: '100%',
    height: '170px',
    objectFit: 'unset',
  },

  [`& .${classes.buttons}`]: {
    position: 'absolute',
    left: '5%',
    top: '4%',
    zIndex: 1,
    display: 'none',
    background: '#fff',
    '& button': {
      background: '#fff',
    },
  },

  [`& .${classes.deleteButtons}`]: {
    position: 'absolute',
    right: '5%',
    top: '4%',
    zIndex: 1,
    display: 'none',
    background: '#fff',
    borderRadius: 40,
    border: 'none',
    borderColor: theme.palette.error.main,
    '& button': {
      background: '#fff',
    },
  },

  [`& .${classes.circularDeleteButton}`]: {
    border: 'none',
  },

  [`& .${classes.box}`]: {
    position: 'relative',
    [`&:hover .${classes.buttons}`]: {
      display: 'block !important',
      borderRadius: 40,
    },
    [`&:hover .${classes.deleteButtons}`]: {
      display: 'block !important',
      borderRadius: 40,
    },
  },

  [`& .${classes.editButton}`]: {
    borderRadius: 40,
  },
}));

interface cardItemWithButtonProps {
  portfolio: any;
  onClick: () => void;
  onDeletePortfolio: (itemId: number) => void;
  fileType?: string;
}

const CardItemWithButton = ({
  portfolio,
  onClick: onclickHandler,
  onDeletePortfolio,
  fileType = 'img',
}: cardItemWithButtonProps) => {
  const {messages} = useIntl();

  return (
    <StyledBox mr={1} ml={1} key={portfolio?.id}>
      <Card>
        <Box className={classes.box}>
          <div className={classes.buttons}>
            <Button
              variant={'outlined'}
              color={'primary'}
              className={classes.editButton}
              onClick={onclickHandler}>
              <BorderColor />
              {messages['common.edit_btn']}
            </Button>
          </div>
          <div className={classes.deleteButtons}>
            {/* <CircularDeleteButton
              className={classes.circularDeleteButton}
              deleteAction={() => {}}
            /> */}
            <CustomConfirmationButton
              confirmAction={async () => {
                await onDeletePortfolio(portfolio?.id);
              }}
              buttonType={'delete'}
              dialogTitle={messages['confirmation_text.portfolio'] as string}
            />
          </div>
          <Link
            href={FILE_SERVER_FILE_VIEW_ENDPOINT + portfolio?.file_path}
            target={'_blank'}>
            <CardMedia
              component='img'
              alt='portfolio'
              className={classes.image}
              image={
                fileType == 'pdf'
                  ? '/images/pdf.png'
                  : FILE_SERVER_FILE_VIEW_ENDPOINT + portfolio?.file_path
              }
            />
          </Link>

          {/*<Image
            className={classes.image}
            src={
              portfolio?.file_path
                ? portfolio.file_path
                : '/images/learner/portfolio.jpeg'
            }
            alt='crema-logo'
            height={50}
            width={'100%'}
            layout={'responsive'}
          />*/}
        </Box>
      </Card>
    </StyledBox>
  );
};

export default CardItemWithButton;
