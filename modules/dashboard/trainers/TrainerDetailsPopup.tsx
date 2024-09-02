import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import IconTrainer from '../../../@core/icons/IconTrainer';
import {useFetchTrainer} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {Gender} from '../../industry/enrollment/constants/GenderEnums';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {InstituteServiceTypes} from '../../../@core/utilities/InstituteServiceTypes';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../@core/components/AddressFormComponent/addressEnum';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const TrainerDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {data: itemData, isLoading} = useFetchTrainer(itemId);
  const {messages, locale} = useIntl();
  const authUser = useAuthUser();

  const {trainer: trainer_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const genders = [
    {
      key: Gender.MALE,
      label: messages['common.male'],
    },
    {
      key: Gender.FEMALE,
      label: messages['common.female'],
    },
    {
      key: Gender.OTHERS,
      label: messages['common.others'],
    },
  ];

  const marital_status = [
    {
      key: 0,
      label: messages['common.unmarried'],
    },
    {
      key: 1,
      label: messages['common.marital_status_married'],
    },
  ];

  const religions = [
    {
      id: 1,
      label: messages['common.religion_islam'],
    },
    {
      id: 2,
      label: messages['common.religion_hinduism'],
    },
    {
      id: 3,
      label: messages['common.religion_christianity'],
    },
    {
      id: 4,
      label: messages['common.religion_buddhism'],
    },
    {
      id: 5,
      label: messages['common.notDefined'],
    },
  ];

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconTrainer />
            <IntlMessages id='trainers.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {trainer_permission.canUpdate && itemData && (
              <EditButton
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.first_name']}
              value={itemData?.trainer_first_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.first_name_en']}
              value={itemData?.trainer_first_name_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.last_name']}
              value={itemData?.trainer_last_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.last_name_en']}
              value={itemData?.trainer_last_name_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.subject']}
              value={itemData?.subject}
              isLoading={isLoading}
            />
          </Grid>{' '}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.subject_en']}
              value={itemData?.subject_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.about_me']}
              value={itemData?.about_me}
              isLoading={isLoading}
            />
          </Grid>
          {authUser?.isInstituteUser &&
            String(authUser?.institute?.service_type) !=
              InstituteServiceTypes.CERTIFICATE &&
            !authUser?.isTrainingCenterUser && (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['branch.label']}
                  value={itemData?.branch_title}
                  isLoading={isLoading}
                />
              </Grid>
            )}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.date_of_birth']}
              value={itemData?.date_of_birth}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <fieldset>
              <legend>{messages['common.present_address']}</legend>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['divisions.label']}
                    value={itemData?.division_title_present_address}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['divisions.label_en']}
                    value={itemData?.division_title_en_present_address}
                    isLoading={isLoading}
                  />
                </Grid>
                {itemData?.present_address_district_or_city_corporation ==
                DistrictOrCityCorporation.DISTRICT ? (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['districts.label']}
                        value={itemData?.district_title_present_address}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['districts.label_en']}
                        value={itemData?.district_title_en_present_address}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={
                          messages[
                            itemData?.loc_upazila_municipality_type_present_address ==
                            UpazilaOrMunicipality.UPAZILA
                              ? 'upazilas.label'
                              : 'municipality.label'
                          ]
                        }
                        value={
                          itemData?.upazila_municipality_title_present_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={
                          messages[
                            itemData?.loc_upazila_municipality_type_present_address ==
                            UpazilaOrMunicipality.UPAZILA
                              ? 'upazilas.label_en'
                              : 'municipality.label_en'
                          ]
                        }
                        value={
                          itemData?.upazila_municipality_title_en_present_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>

                    {itemData?.loc_upazila_municipality_type_present_address ==
                      UpazilaOrMunicipality.UPAZILA && (
                      <>
                        <Grid item xs={12} sm={6} md={6}>
                          <DetailsInputView
                            label={messages['union.label']}
                            value={itemData?.union_title_present_address}
                            isLoading={isLoading}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <DetailsInputView
                            label={messages['union.label_en']}
                            value={itemData?.union_title_en_present_address}
                            isLoading={isLoading}
                          />
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['city_corporation.label_bn']}
                        value={itemData?.city_corporation_title_present_address}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['city_corporation.label_en']}
                        value={
                          itemData?.city_corporation_title_en_present_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages[
                        itemData?.present_address_district_or_city_corporation ==
                          DistrictOrCityCorporation.CITY_CORPORATION ||
                        itemData?.loc_upazila_municipality_type_present_address ==
                          UpazilaOrMunicipality.MUNICIPALITY
                          ? 'common.ward_moholla'
                          : 'common.village_house'
                      ]
                    }
                    value={itemData?.present_address_village_ward_area}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages[
                        itemData?.present_address_district_or_city_corporation ==
                          DistrictOrCityCorporation.CITY_CORPORATION ||
                        itemData?.loc_upazila_municipality_type_present_address ==
                          UpazilaOrMunicipality.MUNICIPALITY
                          ? 'common.ward_moholla_en'
                          : 'common.village_house_en'
                      ]
                    }
                    value={itemData?.present_address_village_ward_area_en}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12}>
            <fieldset>
              <legend>{messages['common.permanent_address']}</legend>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['divisions.label']}
                    value={itemData?.division_title_permanent_address}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['divisions.label_en']}
                    value={itemData?.division_title_en_permanent_address}
                    isLoading={isLoading}
                  />
                </Grid>
                {itemData?.permanent_address_district_or_city_corporation ==
                DistrictOrCityCorporation.DISTRICT ? (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['districts.label']}
                        value={itemData?.district_title_permanent_address}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['districts.label_en']}
                        value={itemData?.district_title_en_permanent_address}
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={
                          messages[
                            itemData?.loc_upazila_municipality_type_permanent_address ==
                            UpazilaOrMunicipality.UPAZILA
                              ? 'upazilas.label'
                              : 'municipality.label'
                          ]
                        }
                        value={
                          itemData?.upazila_municipality_title_permanent_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={
                          messages[
                            itemData?.loc_upazila_municipality_type_permanent_address ==
                            UpazilaOrMunicipality.UPAZILA
                              ? 'upazilas.label_en'
                              : 'municipality.label_en'
                          ]
                        }
                        value={
                          itemData?.upazila_municipality_title_en_permanent_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>

                    {itemData?.loc_upazila_municipality_type_permanent_address ==
                      UpazilaOrMunicipality.UPAZILA && (
                      <>
                        <Grid item xs={12} sm={6} md={6}>
                          <DetailsInputView
                            label={messages['union.label']}
                            value={itemData?.union_title_permanent_address}
                            isLoading={isLoading}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <DetailsInputView
                            label={messages['union.label_en']}
                            value={itemData?.union_title_en_permanent_address}
                            isLoading={isLoading}
                          />
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['city_corporation.label_bn']}
                        value={
                          itemData?.city_corporation_title_permanent_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <DetailsInputView
                        label={messages['city_corporation.label_en']}
                        value={
                          itemData?.city_corporation_title_en_permanent_address
                        }
                        isLoading={isLoading}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages[
                        itemData?.permanent_address_district_or_city_corporation ==
                          DistrictOrCityCorporation.CITY_CORPORATION ||
                        itemData?.loc_upazila_municipality_type_permanent_address ==
                          UpazilaOrMunicipality.MUNICIPALITY
                          ? 'common.ward_moholla'
                          : 'common.village_house'
                      ]
                    }
                    value={itemData?.permanent_address_village_ward_area}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={
                      messages[
                        itemData?.permanent_address_district_or_city_corporation ==
                          DistrictOrCityCorporation.CITY_CORPORATION ||
                        itemData?.loc_upazila_municipality_type_permanent_address ==
                          UpazilaOrMunicipality.MUNICIPALITY
                          ? 'common.ward_moholla_en'
                          : 'common.village_house_en'
                      ]
                    }
                    value={itemData?.permanent_address_village_ward_area_en}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.educational_qualification_bn']}
              value={itemData?.educational_qualification}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.email']}
              value={itemData?.email}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.mobile']}
              value={itemData?.mobile}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.gender']}
              value={genders[itemData?.gender - 1]?.label}
              isLoading={isLoading}
            />
          </Grid>
          {authUser?.isSystemUser && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['institute.label']}
                value={(itemData?.institutes || [])
                  .map((institute: any) => institute.title)
                  .join(', ')}
                isLoading={isLoading}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.marital_status']}
              value={marital_status[itemData?.marital_status]?.label}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.nationality']}
              value={itemData?.nationality}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.nid']}
              value={itemData?.nid}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.passport_number']}
              value={itemData?.passport_number}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.permanent_house_address']}
              value={
                locale == LocaleLanguage.BN
                  ? itemData?.permanent_house_address
                  : itemData?.permanent_house_address_en
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={locale == LocaleLanguage.BN ? messages['common.present_house_address'] : messages['common.present_house_address_en']}
              value={
                locale == LocaleLanguage.BN
                  ? itemData?.present_house_address
                  : itemData?.present_house_address_en
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.religion']}
              value={religions[itemData?.religion - 1]?.label}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['menu.skill']}
              value={(itemData?.skills || [])
                .map((skill: any) =>
                  locale == LocaleLanguage.BN ? skill.title : skill.title_en,
                )
                .join(', ')}
              isLoading={isLoading}
            />
          </Grid>
          {authUser?.isInstituteUser &&
            String(authUser?.institute?.service_type) !=
              InstituteServiceTypes.CERTIFICATE &&
            !authUser?.isTrainingCenterUser && (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['training_center.label']}
                  value={itemData?.training_center_title}
                  isLoading={isLoading}
                />
              </Grid>
            )}
          <Grid item xs={12} sm={6} md={6}>
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
export default TrainerDetailsPopup;
