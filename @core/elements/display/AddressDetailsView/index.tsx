import React from 'react';
import {Grid} from '@mui/material';
import DetailsInputView from '../DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../components/AddressFormComponent/addressEnum';

interface AddressDetailsViewProps {
  itemData: any;
  isLoading?: boolean;
  showAddress?: boolean;
}

const AddressDetailsView = ({
  itemData,
  isLoading = false,
  showAddress = true,
}: AddressDetailsViewProps) => {
  const {messages} = useIntl();

  return (
    <>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['divisions.label']}
          value={itemData?.division_title}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['divisions.label_en']}
          value={itemData?.division_title_en}
          isLoading={isLoading}
        />
      </Grid>
      {itemData?.district_or_city_corporation ==
      DistrictOrCityCorporation.DISTRICT ? (
        <>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['districts.label']}
              value={itemData?.district_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['districts.label_en']}
              value={itemData?.district_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={
                messages[
                  itemData?.loc_upazila_municipality_type ==
                  UpazilaOrMunicipality.UPAZILA
                    ? 'upazilas.label'
                    : 'municipality.label'
                ]
              }
              value={itemData?.upazila_municipality_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={
                messages[
                  itemData?.loc_upazila_municipality_type ==
                  UpazilaOrMunicipality.UPAZILA
                    ? 'upazilas.label_en'
                    : 'municipality.label_en'
                ]
              }
              value={itemData?.upazila_municipality_title_en}
              isLoading={isLoading}
            />
          </Grid>

          {itemData?.loc_upazila_municipality_type ==
            UpazilaOrMunicipality.UPAZILA && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['union.label']}
                  value={itemData?.union_title}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['union.label_en']}
                  value={itemData?.union_title_en}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          )}
        </>
      ) : itemData?.district_or_city_corporation ==
        DistrictOrCityCorporation.CITY_CORPORATION ? (
        <>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['city_corporation.label_bn']}
              value={itemData?.city_corporation_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['city_corporation.label_en']}
              value={itemData?.city_corporation_title_en}
              isLoading={isLoading}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={
            messages[
              itemData?.district_or_city_corporation ==
                DistrictOrCityCorporation.CITY_CORPORATION ||
              itemData?.loc_upazila_municipality_type ==
                UpazilaOrMunicipality.MUNICIPALITY
                ? 'common.ward_moholla'
                : 'common.village_house'
            ]
          }
          value={itemData?.village_ward_area}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={
            messages[
              itemData?.district_or_city_corporation ==
                DistrictOrCityCorporation.CITY_CORPORATION ||
              itemData?.loc_upazila_municipality_type ==
                UpazilaOrMunicipality.MUNICIPALITY
                ? 'common.ward_moholla_en'
                : 'common.village_house_en'
            ]
          }
          value={itemData?.village_ward_area_en}
          isLoading={isLoading}
        />
      </Grid>
      {showAddress && (
        <>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.address']}
              value={itemData?.address}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.address_en']}
              value={itemData?.address_en}
              isLoading={isLoading}
            />
          </Grid>
        </>
      )}
    </>
  );
};
export default AddressDetailsView;
