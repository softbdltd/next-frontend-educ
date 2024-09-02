import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconGallery from '../../../@core/icons/IconGallery';
import {
  useFetchCMSGlobalConfig,
  useFetchGalleryAlbum,
} from '../../../services/cmsManagement/hooks';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import AlbumTypes from './AlbumTypes';
import {
  getLanguageLabel,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const GalleryAlbumDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchGalleryAlbum(itemId);
  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const {gallery_album: gallery_album_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getAlbumTypeTitle = (albumType: number) => {
    switch (albumType) {
      case AlbumTypes.IMAGE:
        return messages['album_type.image'];
      case AlbumTypes.VIDEO:
        return messages['album_type.video'];
      case AlbumTypes.MIXED:
        return messages['common.mixed'];
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
            {itemData && gallery_album_permissions.canUpdate && (
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
              label={messages['common.show_in']}
              value={itemData?.show_in_label}
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
              label={messages['gallery_album.album_type']}
              value={getAlbumTypeTitle(itemData?.album_type)}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['gallery_album.parent_gallery_album']}
              value={itemData?.parent_gallery_album_title}
              isLoading={isLoading}
            />
          </Grid>

          {itemData?.show_in && itemData.show_in == ShowInTypes.TSP && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['common.institute_name']}
                value={itemData?.institute_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData?.show_in && itemData.show_in == ShowInTypes.INDUSTRY && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['organization.label']}
                value={itemData?.organization_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData?.show_in &&
            itemData.show_in == ShowInTypes.INDUSTRY_ASSOCIATION && (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.industry_association']}
                  value={itemData?.industry_association_title}
                  isLoading={isLoading}
                />
              </Grid>
            )}
          {itemData?.show_in && itemData.show_in == ShowInTypes.MINISTRY && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['common.ministry']}
                value={itemData?.ministry_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['programme.label']}
              value={itemData?.program_title}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['course.label']}
              value={itemData?.course_title}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.main_image_path']}
              imageUrl={itemData?.main_image_path}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.grid_image_path']}
              imageUrl={itemData?.grid_image_path}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.thumb_image_path']}
              imageUrl={itemData?.thumb_image_path}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.publish_at']}
              value={
                itemData?.published_at
                  ? getMomentDateFormat(itemData.published_at, 'YYYY-MM-DD')
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
                  ? getMomentDateFormat(itemData.archived_at, 'YYYY-MM-DD')
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

export default GalleryAlbumDetailsPopup;
