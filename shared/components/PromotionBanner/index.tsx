import React, {useContext} from 'react';
import CustomMuiModal, {
  DialogTitle,
} from '../../../@core/modals/CustomMuiModal/CustomMuiModal';
import {Box} from '@mui/material';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {promotionBannerContext} from '../../../@core/utility/ContextProvider/PromotionBannerProvider';

const Index = () => {
  const [promotionBanner, setPromotionalBanner] = useContext(
    promotionBannerContext,
  );
  const handleOnClose = () => {
    if (setPromotionalBanner) {
      setPromotionalBanner({
        content: '',
        is_enabled: false,
        with_background: true,
      });
    }
  };

  return (
    <CustomMuiModal
      classNames={`${
        promotionBanner?.with_background === true
          ? 'landing-page-popup-notice'
          : 'landing-page-without-bg-popup-notice'
      } `}
      open={promotionBanner.is_enabled}
      onClose={() => handleOnClose}
      maxWidth={isBreakPointUp('md') ? 'md' : 'sm'}>
      <DialogTitle onClose={handleOnClose}>{}</DialogTitle>
      <Box
        sx={{
          ['& img']: {
            maxWidth: '100%',
          },
        }}>
        <div
          dangerouslySetInnerHTML={{
            __html: promotionBanner?.content,
          }}
        />
      </Box>
    </CustomMuiModal>
  );
};

export default Index;
