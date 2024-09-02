import React, {useEffect, useState, useContext} from 'react';
import {FormControlLabel, Grid, Radio, RadioGroup} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import {WorkOutline} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import {getLanguageLabel} from '../../../@core/utilities/helpers';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import {getStaticPageOrBlockByPageCode} from '../../../services/cmsManagement/StaticPageService';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import StaticPageTypes from './StaticPageTypes';
import PageBlockTemplateTypes from '../../../@core/utilities/PageBlockTemplateTypes';
import ContentTypes from '../recentActivities/ContentTypes';
import StaticPageCategoryTypes from '../../../@core/utilities/StaticPageCategoryTypes';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import showInTypes from '../../../@core/utilities/ShowInTypes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  pageCode: string;
  pageType: number;
  pageCategory: number;
  onClose: () => void;
  openEditModal: (page: any) => void;
};

const StaticPageDetailsPopup = ({
  pageCode,
  pageType,
  pageCategory,
  openEditModal,
  ...props
}: Props) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const [itemData, setItemData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showInList, setShowInList] = useState<Array<any>>([]);
  const [showIn, setShowIn] = useState<number | null>(null);

  const {static_page_content_or_page_block: static_page_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  useEffect(() => {
    if (authUser && authUser?.isSystemUser) {
      switch (pageCategory) {
        case StaticPageCategoryTypes.COMMON:
          setShowIn(ShowInTypes.NICE3);
          break;
        case StaticPageCategoryTypes.EDUC:
          setShowIn(ShowInTypes.NICE3);
          break;
        case StaticPageCategoryTypes.LEARNER:
          setShowIn(ShowInTypes.LEARNER);
          break;
        case StaticPageCategoryTypes.RPL:
          setShowIn(ShowInTypes.RPL);
          break;
        case StaticPageCategoryTypes.MINISTRY:
          setShowIn(ShowInTypes.MINISTRY);
          break;
        default:
          setShowIn(null);
      }
    }
  }, [pageCategory, authUser]);

  useEffect(() => {
    if (authUser && !authUser?.isSystemUser) {
      (async () => {
        setIsLoading(true);
        const response = await getStaticPageOrBlockByPageCode(pageCode, {});
        if (response && response.data) setItemData(response.data);
        setIsLoading(false);
      })();
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && showIn) {
      (async () => {
        setIsLoading(true);
        setItemData(null);
        try {
          const params: any = {show_in: showIn};

          const response = await getStaticPageOrBlockByPageCode(
            pageCode,
            params,
          );
          if (response && response.data) setItemData(response.data);
        } catch (e) {}
        setIsLoading(false);
      })();
    }
  }, [authUser, showIn]);

  useEffect(() => {
    if (cmsGlobalConfig) {
      const filteredShowIn = cmsGlobalConfig?.show_in?.filter((item: any) =>
        [
          ShowInTypes.NICE3,
          ShowInTypes.LEARNER,
          ShowInTypes.RPL,
          showInTypes.MINISTRY,
        ].includes(item.id),
      );

      setShowInList(filteredShowIn);
    }
  }, [cmsGlobalConfig]);

  const getTemplateCodeTitle = (templateCode: string) => {
    switch (templateCode) {
      case PageBlockTemplateTypes.PBT_LR:
        return messages['page_block.template_code_pbt_lr'];
      case PageBlockTemplateTypes.PBT_RL:
        return messages['page_block.template_code_pbt_rl'];
      case PageBlockTemplateTypes.PBT_SHOW_EDITOR_CONTENT:
        return messages['page_block.template_code_pbt_show_editor_content'];
      default:
        return '';
    }
  };

  const getAttachmentTypeTitle = (attachmentType: number) => {
    switch (attachmentType) {
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

  return (
    <>
      <CustomDetailsViewMuiModal
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        open={true}
        {...props}
        title={
          <>
            <WorkOutline />
            <IntlMessages id='static_page.label' />
          </>
        }
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />

            {static_page_permissions.canUpdate && (
              <EditButton
                onClick={() =>
                  openEditModal({
                    page_code: pageCode,
                    type: pageType,
                    category: pageCategory,
                  })
                }
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          {authUser &&
            authUser.isSystemUser &&
            pageCategory == StaticPageCategoryTypes.COMMON && (
              <React.Fragment>
                <Grid item xs={12} sm={6} md={6}>
                  <RadioGroup
                    row
                    aria-label={'show_in'}
                    value={showIn}
                    onChange={(e) => {
                      setShowIn(Number(e.target.value));
                    }}>
                    {showInList.map((item: any) => (
                      <FormControlLabel
                        key={item.id}
                        value={item.id}
                        control={<Radio />}
                        label={item.title}
                      />
                    ))}
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6} md={6} />
              </React.Fragment>
            )}

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.title']}
              value={itemData?.title}
              isLoading={isLoading}
            />
          </Grid>

          {pageType == StaticPageTypes.PAGE && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['common.sub_title']}
                value={itemData?.sub_title}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {pageType == StaticPageTypes.BLOCK && (
            <React.Fragment>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['static_page.template_code']}
                  value={getTemplateCodeTitle(itemData?.template_code)}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.is_attachment_available']}
                  value={
                    itemData?.is_attachment_available == 1
                      ? messages['common.yes']
                      : messages['common.no']
                  }
                  isLoading={isLoading}
                />
              </Grid>

              {itemData?.is_attachment_available == 1 && (
                <React.Fragment>
                  <Grid item xs={12} sm={6} md={6}>
                    <DetailsInputView
                      label={messages['common.attachment_type']}
                      value={getAttachmentTypeTitle(itemData?.attachment_type)}
                      isLoading={isLoading}
                    />
                  </Grid>

                  {itemData?.attachment_type == ContentTypes.IMAGE && (
                    <React.Fragment>
                      <Grid item xs={12} sm={6} md={6}>
                        <ImageView
                          label={messages['common.image_path']}
                          imageUrl={itemData?.image_path}
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
                    </React.Fragment>
                  )}

                  {itemData?.attachment_type != ContentTypes.IMAGE && (
                    <React.Fragment>
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
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}

              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.is_button_available']}
                  value={
                    itemData?.is_button_available == 1
                      ? messages['common.yes']
                      : messages['common.no']
                  }
                  isLoading={isLoading}
                />
              </Grid>

              {itemData?.is_button_available == 1 && (
                <React.Fragment>
                  <Grid item xs={12} sm={6} md={6}>
                    <DetailsInputView
                      label={messages['common.button_text']}
                      value={itemData?.button_text}
                      isLoading={isLoading}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          <Grid item xs={12}>
            <fieldset>
              <legend>
                {getLanguageLabel(
                  cmsGlobalConfig?.language_configs,
                  LanguageCodes.BANGLA,
                )}
              </legend>
              <Grid container spacing={5}>
                <Grid
                  item
                  xs={12}
                  md={pageType == StaticPageTypes.PAGE ? 6 : 12}>
                  <DetailsInputView
                    label={messages['common.title']}
                    value={itemData?.title}
                    isLoading={isLoading}
                  />
                </Grid>

                {pageType == StaticPageTypes.PAGE && (
                  <Grid item xs={12} sm={6} md={6}>
                    <DetailsInputView
                      label={messages['common.sub_title']}
                      value={itemData?.sub_title}
                      isLoading={isLoading}
                    />
                  </Grid>
                )}

                {pageType == StaticPageTypes.BLOCK && (
                  <React.Fragment>
                    {itemData?.attachment_type == ContentTypes.IMAGE && (
                      <Grid item xs={12} sm={6} md={6}>
                        <DetailsInputView
                          label={messages['common.image_alt_title']}
                          value={itemData?.image_alt_title}
                          isLoading={isLoading}
                        />
                      </Grid>
                    )}

                    {itemData?.is_button_available == 1 && (
                      <Grid item xs={12} sm={6} md={6}>
                        <DetailsInputView
                          label={messages['common.button_text']}
                          value={itemData?.button_text}
                          isLoading={isLoading}
                        />
                      </Grid>
                    )}
                  </React.Fragment>
                )}

                <Grid item xs={12}>
                  <DetailsInputView
                    label={messages['common.content']}
                    value={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: itemData?.content,
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
                    <Grid
                      item
                      xs={12}
                      md={pageType == StaticPageTypes.PAGE ? 6 : 12}>
                      <DetailsInputView
                        label={messages['common.title']}
                        value={itemData.other_language_fields[key]?.title}
                        isLoading={isLoading}
                      />
                    </Grid>
                    {pageType == StaticPageTypes.PAGE && (
                      <Grid item xs={12} sm={6} md={6}>
                        <DetailsInputView
                          label={messages['common.sub_title']}
                          value={itemData.other_language_fields[key]?.sub_title}
                          isLoading={isLoading}
                        />
                      </Grid>
                    )}

                    {pageType == StaticPageTypes.BLOCK && (
                      <React.Fragment>
                        {itemData?.attachment_type == ContentTypes.IMAGE && (
                          <Grid item xs={12} sm={6} md={6}>
                            <DetailsInputView
                              label={messages['common.image_alt_title']}
                              value={
                                itemData.other_language_fields[key]
                                  ?.image_alt_title
                              }
                              isLoading={isLoading}
                            />
                          </Grid>
                        )}

                        {itemData?.is_button_available == 1 && (
                          <Grid item xs={12} sm={6} md={6}>
                            <DetailsInputView
                              label={messages['common.button_text']}
                              value={
                                itemData.other_language_fields[key]?.button_text
                              }
                              isLoading={isLoading}
                            />
                          </Grid>
                        )}
                      </React.Fragment>
                    )}

                    <Grid item xs={12}>
                      <DetailsInputView
                        label={messages['common.content']}
                        value={
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                itemData.other_language_fields[key]?.content,
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
export default StaticPageDetailsPopup;
