import React, {useState} from 'react';
import ImageCarousel from '../../@core/elements/display/ImageCarousel/ImageCarousel';
import {useFetchPublicSliders} from '../../services/cmsManagement/hooks';
import BannerTemplateCenterBackground from './Components/BannerTemplateCenterBackground';
import BannerTemplateRightLeft from './Components/BannerTemplateRightLeft';
import BannerTemplateLeftRight from './Components/BannerTemplateLeftRight';
import {Skeleton} from '@mui/material';
import BannerTemplateBackgroundImage from './Components/BannerTemplateBackgroundImage';

const CoverArea = () => {
  const [sliderFilters] = useState({});
  const {data: sliders, isLoading: isLoadingSliders} =
    useFetchPublicSliders(sliderFilters);
  const slider = sliders?.[0];
  const banners = slider?.banners;
  const numberOfBanners = banners?.length;

  const getBannerTemplate = (banner: any) => {
    switch (banner?.banner_template_code) {
      case 'BT_CB':
        return <BannerTemplateCenterBackground banner={banner} />;
      case 'BT_RL':
        return <BannerTemplateRightLeft banner={banner} />;
      case 'BT_LR':
        return <BannerTemplateLeftRight banner={banner} />;
      case 'BT_OB':
        return <BannerTemplateBackgroundImage banner={banner} />;
      default:
        return <BannerTemplateCenterBackground banner={banner} />;
    }
  };

  return isLoadingSliders ? (
    <Skeleton variant={'rectangular'} width={'100%'} height={400} />
  ) : banners && numberOfBanners == 1 ? (
    getBannerTemplate(banners[0])
  ) : banners && numberOfBanners > 1 ? (
    <ImageCarousel banners={banners} />
  ) : (
    <></>
  );
};

export default CoverArea;
