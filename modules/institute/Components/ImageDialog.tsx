import * as React from 'react';
import {FC, ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {getEmbeddedVideoUrl} from '../../../@core/utilities/helpers';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';

const StyledDialog = styled(Dialog)(({theme}) => ({
  padding: theme.spacing(0),
  '& .MuiDialogContent-root': {
    border: 0,
    padding: theme.spacing(0),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(0),
  },
}));

interface CustomizedDialogsProps {
  data: {
    title: string | ReactNode;
    imagePath?: string;
    videoUrl?: string;
    details?: string;
  };
  onClose?: any;
}

const CustomizedDialogs: FC<CustomizedDialogsProps> = ({
  data,
  onClose,
}: any) => {
  let videoUrl = null;
  if (data.videoUrl) {
    const embeddedUrl = getEmbeddedVideoUrl(data.videoUrl);
    if (embeddedUrl) videoUrl = embeddedUrl;
    else videoUrl = data.videoUrl;
  }

  return (
    <div>
      <StyledDialog
        aria-labelledby='customized-dialog-title'
        open={true}
        maxWidth={'md'}
        PaperProps={{
          sx: {minWidth: '700px', padding: '20px'},
        }}>
        <DialogTitle sx={{m: 0, p: 0, marginBottom: '20px'}}>
          <span
            style={{
              width: 'calc(100% - 25px)',
              display: 'block',
              lineHeight: 1,
            }}>
            {data.title}
          </span>
          {onClose ? (
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}>
              <CloseIcon />
            </IconButton>
          ) : (
            <></>
          )}
        </DialogTitle>
        <DialogContent>
          {data?.imagePath && (
            <CardMediaImageView
              sx={{display: 'block'}}
              width={'100%'}
              height='350'
              image={data?.imagePath}
            />
          )}

          {videoUrl && (
            <iframe
              width='100%'
              height='350'
              style={{
                borderRadius: '15px',
              }}
              src={videoUrl}
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
              title='Embedded youtube'
            />
          )}

          {data.details && (
            <div
              dangerouslySetInnerHTML={{
                __html: data.details,
              }}
            />
          )}
        </DialogContent>
      </StyledDialog>
    </div>
  );
};

export default CustomizedDialogs;
