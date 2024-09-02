import HorizontalLine from '../component/HorizontalLine';
import React, {useState, useEffect} from 'react';
import * as _ from 'lodash';
import {Avatar, Box, Grid, Typography} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {BorderColor, Email, LocationOn} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import {YouthReference} from '../../../../services/learnerManagement/typing';
import TextPrimary from '../component/TextPrimary';
import VerticalLine from '../component/VerticalLine';
import {styled} from '@mui/material/styles';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import {S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import CustomConfirmationButton from '../component/CustomConfirmationButton';
import {learnerProfileShowInCV} from '../../../../services/learnerManagement/YouthService';
import CustomCheckboxWithoutForm from '../../../../@core/elements/input/CustomCheckboxWithoutForm';
import {FiTrash2} from 'react-icons/fi';

const PREFIX = 'References';
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

type ReferencesProp = {
  references: Array<YouthReference> | undefined;
  openReferenceAddEditForm: (referenceId: number) => void;
  onDeleteReference: (referenceId: number) => void;
  disabled: boolean;
};

const References = ({
  references,
  openReferenceAddEditForm,
  onDeleteReference,
  disabled,
}: ReferencesProp) => {
  const {messages} = useIntl();
  const result = useCustomStyle();

  const [showInCV, setShowInCV] = useState<any>({});

  useEffect(() => {
    const defaultValue: any = {};
    references?.forEach((item: any) => {
      defaultValue[item?.id] = item?.show_in_cv;
    });
    setShowInCV(defaultValue);
  }, [references]);

  const handleChangeForReferences = async (id: any) => {
    const showInCVValue = !showInCV[id];

    setShowInCV((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));

    //   api call

    try {
      await learnerProfileShowInCV({
        module: 'learner_references',
        module_id: id,
        show_in_cv: showInCVValue ? 1 : 0,
      });
    } catch (error: any) {}
  };

  const debounceFn = _.debounce(handleChangeForReferences, 500);

  return (
    <React.Fragment>
      {(references || []).map((reference: any) => (
        <React.Fragment key={reference?.id}>
          <HorizontalLine />

          <Grid container justifyContent={'space-between'}>
            <Grid item xs={12} md={8}>
              <Grid container>
                <Grid item xs={4} md={2}>
                  <Avatar
                    alt={'Reference logo'}
                    src={'/images/placeholder.jpg'}
                    sx={{height: 80, width: 80}}
                  />
                </Grid>
                <StyledGrid item xs={8} md={10}>
                  <Box>
                    <S1
                      sx={{...result.subtitle2}}
                      className={classes.textStyle}>
                      {reference?.referrer_first_name}{' '}
                      {reference?.referrer_last_name}
                    </S1>
                    <Typography variant={'caption'}>
                      {reference?.referrer_designation},
                    </Typography>
                    <Typography variant={'caption'}>
                      {reference?.referrer_organization_name}
                    </Typography>
                    <Box>
                      <Grid container sx={{marginTop: '10px'}}>
                        <Grid item sx={{display: 'flex'}}>
                          <Email color={'primary'} sx={{marginRight: '5px'}} />
                          <TextPrimary text={reference?.referrer_email} />
                        </Grid>
                        <VerticalLine />
                        <Grid item sx={{display: 'flex'}}>
                          <LocalPhoneIcon
                            color={'primary'}
                            sx={{marginRight: '5px'}}
                          />
                          <TextPrimary text={reference?.referrer_mobile} />
                        </Grid>
                        <VerticalLine />
                        <Grid item sx={{display: 'flex'}}>
                          <LocationOn
                            color={'primary'}
                            sx={{marginRight: '5px'}}
                          />
                          <TextPrimary text={reference?.referrer_address} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </StyledGrid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container justifyContent={'center'}>
                <Box mt={2}>
                  <CustomParabolaButton
                    buttonVariant={'outlined'}
                    title={messages['common.edit_btn'] as string}
                    icon={<BorderColor />}
                    onClick={() => {
                      openReferenceAddEditForm(reference.id);
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
                        await onDeleteReference(reference.id);
                      }}
                      buttonType={'delete'}
                      dialogTitle={
                        messages['confirmation_text.references'] as string
                      }
                      disabled={disabled}
                    />
                  )}
                </Box>
                <Grid item xs={12} sx={{m: 1, ml: 3}}>
                  <CustomCheckboxWithoutForm
                    id={`is_certificate_${reference.id}`}
                    label={messages['common.is_show_in_cv']}
                    checked={!!showInCV[reference.id]}
                    onChange={() => debounceFn(reference.id)}
                    isDisabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
export default References;
