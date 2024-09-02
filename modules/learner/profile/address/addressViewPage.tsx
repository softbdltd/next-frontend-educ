import {IAddress} from '../../../../services/learnerManagement/typing';
import {useIntl} from 'react-intl';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import HorizontalLine from '../component/HorizontalLine';
import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid} from '@mui/material';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {BorderColor} from '@mui/icons-material';
import {S1} from '../../../../@core/elements/common';
import CustomConfirmationButton from '../component/CustomConfirmationButton';
import {FiTrash2} from 'react-icons/fi';

const PREFIX = 'AddressViewPage';
const classes = {
  textStyle: `${PREFIX}-textStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
}));

interface Props {
  addresses: any[];
  onOpenAddEditForm: (itemId: number) => void;
  onDeleteAddress: (itemId: number) => void;
  disabled: boolean;
}

const AddressViewPage = ({
  addresses,
  onOpenAddEditForm,
  onDeleteAddress,
  disabled,
}: Props) => {
  const {messages} = useIntl();
  const style = useCustomStyle();

  const getAddressString = (address: IAddress) => {
    const addressStr: Array<string> = [];

    if (address && address.house_n_road) {
      addressStr.push(address.house_n_road);
    }
    if (address && address.village_ward_area) {
      addressStr.push(address.village_ward_area);
    }
    if (address && address.zip_or_postal_code) {
      addressStr.push(
        messages['common.zip_or_postal_code'] +
          ' - ' +
          address.zip_or_postal_code,
      );
    }
    if (address && address.union_title) {
      addressStr.push(address.union_title);
    }
    if (address && address.upazila_municipality_title) {
      addressStr.push(address.upazila_municipality_title);
    }
    if (address && address.district_title) {
      addressStr.push(address.district_title);
    }
    if (address && address.city_corporation_title) {
      addressStr.push(address.city_corporation_title);
    }
    if (address && address.division_title) {
      addressStr.push(address.division_title);
    }

    return addressStr.join(', ');
  };

  return (
    <>
      {addresses.map((address: IAddress) => (
        <React.Fragment key={address.id}>
          <HorizontalLine />
          <StyledGrid container spacing={2}>
            <Grid item xs={12} sm={8} md={8}>
              <S1 sx={{...style.subtitle2}} className={classes.textStyle}>
                {address.address_type == 1
                  ? messages['common.present_address']
                  : address.address_type == 2
                  ? messages['common.permanent_address']
                  : messages['common.other_address']}
              </S1>
              <p tabIndex={0}>

              {getAddressString(address)}
              </p>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CustomParabolaButton
                  buttonVariant={'outlined'}
                  title={messages['common.edit_btn'] as string}
                  aria-label={`${messages['common.edit_btn']} form popup open`}
                  icon={<BorderColor />}
                  onClick={() => {
                    onOpenAddEditForm(address.id);
                  }}
                  disabled={disabled}
                />
                {disabled ? (
                  <span style={{paddingLeft: 5}}>
                    <CustomParabolaButton
                      buttonVariant={'outlined'}
                      title={messages['common.delete'] as string}
                      icon={<FiTrash2 />}
                      disabled={disabled}
                    />
                  </span>
                ) : (
                  <CustomConfirmationButton
                    confirmAction={async () => {
                      await onDeleteAddress(address.id);
                    }}
                    buttonType={'delete'}
                    dialogTitle={
                      messages['confirmation_text.address'] as string
                    }
                    disabled={disabled}
                  />
                )}
              </Box>
            </Grid>
          </StyledGrid>
        </React.Fragment>
      ))}
    </>
  );
};

export default AddressViewPage;
