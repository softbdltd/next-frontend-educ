import React, {FC, useContext} from 'react';
import {useIntl} from 'react-intl';
import {
  useFetchCMSGlobalConfig,
  useFetchRecentActivity,
} from '../../../services/cmsManagement/hooks';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import {
  getLanguageLabel,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import ContentTypes from './ContentTypes';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IconVideo from '../../../@core/icons/IconVideo';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import CollagePosition from './CollagePosition';

interface RecentActivitiesDetailsPopupProps {
  itemId: number | null;
  onClose: () => void;
  openEditModal: (id: number) => void;
}

const RecentActivitiesDetailsPopup: FC<RecentActivitiesDetailsPopupProps> = ({
  itemId,
  openEditModal,
  ...props
}) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchRecentActivity(itemId);
  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();

  const {recent_activity: recent_activity_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getContentTypeTitle = (contentType: number) => {
    switch (contentType) {
      case ContentTypes.IMAGE:
        return messages['content_type.image'];
      case ContentTypes.FACEBOOK_SOURCE:
        return messages['content_type.facebook_video'];
      case ContentTypes.YOUTUBE_SOURCE:
        return messages['content_type.youtube_video'];
      default:
        return '';
    }
  };

  const getCollagePositionTitle = (contentType: number) => {
    switch (contentType) {
      case CollagePosition.LEFT:
        return messages['collage_position.left'];
      case CollagePosition.RIGHT_TOP:
        return messages['collage_position.right_top'];
      case CollagePosition.RIGHT_BOTTOM_1:
        return messages['collage_position.right_bottom_1'];
      case CollagePosition.RIGHT_BOTTOM_2:
        return messages['collage_position.right_bottom_2'];
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
            <IconVideo />
            <IntlMessages id='recent_activities.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && recent_activity_permissions.canUpdate ? (
              <EditButton
                variant='contained'
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            ) : (
              ''
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
            )}{' '}
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
              label={messages['common.content_type']}
              value={getContentTypeTitle(itemData?.content_type)}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.image_path']}
              imageUrl={itemData?.image_path}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.collage_position']}
              value={getCollagePositionTitle(itemData?.collage_position)}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.collage_image_path && (
            <Grid item xs={12} sm={6} md={6}>
              <ImageView
                label={messages['common.collage_image_path']}
                imageUrl={itemData?.collage_image_path}
                isLoading={isLoading}
              />
            </Grid>
          )}
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
              label={messages['common.video_id']}
              value={itemData?.video_id}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.video_url']}
              value={itemData?.video_url}
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
            <CustomChipRowStatus
              label={messages['common.status']}
              value={itemData?.row_status}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default RecentActivitiesDetailsPopup;
