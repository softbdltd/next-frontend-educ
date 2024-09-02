import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconGallery from '../../../@core/icons/IconGallery';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import {
  useFetchCMSGlobalConfig,
  useFetchGalleryAlbumContent,
} from '../../../services/cmsManagement/hooks';
import GalleryAlbumContentTypes from './GalleryAlbumContentTypes';
import {
  getLanguageLabel,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const GalleryAlbumContentDetailsPopup = ({
  itemId,
  openEditModal,
  ...props
}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchGalleryAlbumContent(itemId);
  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const {gallery_album: gallery_album_contents_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const getContentTypeTitle = (contentType: number) => {
    switch (contentType) {
      case GalleryAlbumContentTypes.IMAGE:
        return messages['common.image'];
      case GalleryAlbumContentTypes.VIDEO:
        return messages['common.video'];
      default:
        return '';
    }
  };

  const getVideoTypeTitle = (videoType: number) => {
    switch (videoType) {
      case 1:
        return messages['common.youtube'];
      case 2:
        return messages['common.facebook'];
      default:
        return '';
    }
  };

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconGallery />
            <IntlMessages id='galleries.institute' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && gallery_album_contents_permissions.canUpdate && (
              <EditButton
                variant='contained'
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.gallery_album']}
              value={itemData?.gallery_album_title}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['gallery_album.featured_status']}
              value={
                itemData?.featured == 1
                  ? messages['common.yes']
                  : messages['common.no']
              }
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.content_type']}
              value={getContentTypeTitle(itemData?.content_type)}
              isLoading={isLoading}
            />
          </Grid>

          {itemData?.content_type == GalleryAlbumContentTypes.IMAGE && (
            <Grid item xs={12} sm={6} md={6}>
              <ImageView
                label={messages['common.image_path']}
                imageUrl={itemData?.image_path}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData?.content_type == GalleryAlbumContentTypes.VIDEO && (
            <React.Fragment>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.video_type']}
                  value={getVideoTypeTitle(itemData?.video_type)}
                  isLoading={isLoading}
                />
              </Grid>
              {/*<Grid item xs={12} sm=6 md={6}>*/}
              {/*  <DetailsInputView*/}
              {/*    label={messages['common.video_id']}*/}
              {/*    value={itemData?.video_id}*/}
              {/*    isLoading={isLoading}*/}
              {/*  />*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.video_url']}
                  value={itemData?.video_url}
                  isLoading={isLoading}
                />
              </Grid>
            </React.Fragment>
          )}

          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.grid_image_path']}
              imageUrl={itemData?.content_grid_image_path}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.thumb_image_path']}
              imageUrl={itemData?.content_thumb_image_path}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.publish_at']}
              value={
                itemData?.published_at
                  ? getMomentDateFormat(itemData?.published_at, 'DD MMM, YYYY')
                  : ''
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.archived_at']}
              value={
                itemData?.archived_at
                  ? getMomentDateFormat(itemData?.archived_at, 'DD MMM, YYYY')
                  : ''
              }
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <fieldset>
              <legend>
                {getLanguageLabel(
                  cmsGlobalConfig?.language_configs,
                  LanguageCodes.BANGLA,
                )}
              </legend>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.title']}
                    value={itemData?.title}
                    isLoading={isLoading}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.image_alt_title']}
                    value={itemData?.image_alt_title}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    label={messages['common.description']}
                    value={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: itemData?.description,
                        }}
                      />
                    }
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          {Object.keys(itemData?.other_language_fields || {}).map(
            (key: string) => (
              <Grid item xs={12} key={key}>
                <fieldset>
                  <legend>
                    {getLanguageLabel(cmsGlobalConfig?.language_configs, key)}
                  </legend>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['common.title']}
                        value={itemData.other_language_fields[key]?.title}
                        isLoading={isLoading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['common.image_alt_title']}
                        value={
                          itemData.other_language_fields[key]?.image_alt_title
                        }
                        isLoading={isLoading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <DetailsInputView
                        label={messages['common.description']}
                        value={
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                itemData.other_language_fields[key]
                                  ?.description,
                            }}
                          />
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
            ),
          )}

          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.status']}
              value={<DecoratedRowStatus rowStatus={itemData?.row_status} />}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default GalleryAlbumContentDetailsPopup;
