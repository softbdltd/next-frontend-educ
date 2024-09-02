import React, {FC, useContext} from 'react';
import {useIntl} from 'react-intl';
import {
  useFetchCMSGlobalConfig,
  useFetchNoticeOrNews,
} from '../../../services/cmsManagement/hooks';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import NoticeOrNewsTypes from '../../../@core/utilities/NoticeOrNewsTypes';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import {
  getLanguageLabel,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

interface NoticeOrNewsDetailsPopupProps {
  itemId: number | null;
  onClose: () => void;
  openEditModal: (id: number) => void;
}

const NoticeOrNewsDetailsPopup: FC<NoticeOrNewsDetailsPopupProps> = ({
  itemId,
  openEditModal,
  ...props
}) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchNoticeOrNews(itemId);
  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();

  const {notice_or_news: notice_or_news_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getNoticeOrNewsTitle = (type: number) => {
    switch (type) {
      case NoticeOrNewsTypes.NOTICE:
        return messages['notice_type.notice'];
      case NoticeOrNewsTypes.NEWS:
        return messages['notice_type.news'];
      case NoticeOrNewsTypes.UPCOMING_EVENTS:
        return messages['common.upcoming_events'];
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
            <IconStaticPage />
            <IntlMessages id='common.notice_or_news' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && notice_or_news_permission.canUpdate && (
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
              label={messages['common.type']}
              value={getNoticeOrNewsTitle(itemData?.type)}
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
            <ImageView
              label={messages['common.file_path']}
              imageUrl={itemData?.file_path}
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
                <Grid item xs={12}>
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

                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['common.file_alt_title']}
                    value={itemData?.file_alt_title}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsInputView
                    label={messages['common.details']}
                    value={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: itemData?.details,
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
                    <Grid item xs={12}>
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

                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['common.file_alt_title']}
                        value={
                          itemData.other_language_fields[key]?.file_alt_title
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailsInputView
                        label={messages['common.details']}
                        value={
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                itemData.other_language_fields[key]?.details,
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

export default NoticeOrNewsDetailsPopup;
