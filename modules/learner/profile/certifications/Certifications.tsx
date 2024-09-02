import React, {FC, useEffect, useState} from 'react';
import * as _ from 'lodash';
import {YouthCertificate} from '../../../../services/learnerManagement/typing';
import {Avatar, Box, Grid, IconButton, Typography} from '@mui/material';
import {AccessTime, BorderColor} from '@mui/icons-material';
import TextPrimary from '../component/TextPrimary';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {useIntl} from 'react-intl';
import {getIntlDateFromString} from '../../../../@core/utilities/helpers';
import HorizontalLine from '../component/HorizontalLine';
import VerticalLine from '../component/VerticalLine';
import {styled} from '@mui/material/styles';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import {Link, S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../../@core/common/apiRoutes';
import {learnerDomain} from '../../../../@core/common/constants';
import {LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW} from '../../../../@core/common/appLinks';
import CustomConfirmationButton from '../component/CustomConfirmationButton';
import {learnerProfileShowInCV} from '../../../../services/learnerManagement/YouthService';
import CustomCheckboxWithoutForm from '../../../../@core/elements/input/CustomCheckboxWithoutForm';
import {FiTrash2} from 'react-icons/fi';
import CustomChipApprovalStatus from "../../../dashboard/humanResourceDemands/CustomChipApprovalStatus";

const PREFIX = 'Certifications';
const classes = {
  textStyle: `${PREFIX}-textStyle`,
  buttonStyle: `${PREFIX}-buttonStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
  [`& .${classes.buttonStyle}`]: {
    borderRadius: 40,
  },
}));

interface CertificationsProps {
  certificates: Array<YouthCertificate>;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
  disabled: boolean;
}

const Certifications: FC<CertificationsProps> = ({
                                                   certificates,
                                                   onEditClick,
                                                   onDeleteClick,
                                                   disabled,
                                                 }) => {
  const {messages, formatDate} = useIntl();
  const result = useCustomStyle();

  const [showInCV, setShowInCV] = useState<any>({});

  useEffect(() => {
    const defaultValue: any = {};
    certificates?.forEach((item: any) => {
      defaultValue[item?.id] = item?.show_in_cv;
    });
    setShowInCV(defaultValue);
  }, [certificates]);

  const handleChangeForCertificates = async (id: any) => {
    const showInCVValue = !showInCV[id];

    setShowInCV((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));

    //   api call

    try {
      await learnerProfileShowInCV({
        module: 'learner_certifications',
        module_id: id,
        show_in_cv: showInCVValue ? 1 : 0,
      });
    } catch (error: any) {
    }
  };

  const debounceFn = _.debounce(handleChangeForCertificates, 500);

  return (
    <React.Fragment>
      {(certificates || []).map((certificate: YouthCertificate) => {
        return (
          <React.Fragment key={certificate.id}>
            <HorizontalLine/>
            <StyledGrid container spacing={2}>
              <Grid item xs={12} sm={8} md={8}>
                <Box sx={{display: 'flex'}}>
                  <Avatar>
                    <CardMembershipIcon/>
                  </Avatar>

                  <Box sx={{marginLeft: '15px'}}>
                    <S1
                      sx={{...result.subtitle2}}
                      className={classes.textStyle}>
                      {certificate.certification_name}
                    </S1>
                    <Typography variant={'caption'}>
                      {certificate.institute_name}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Grid container sx={{marginTop: '10px'}}>
                    `
                    {certificate?.start_date && (
                      <React.Fragment>
                        <Grid item sx={{display: 'flex'}}>
                          <AccessTime
                            color={'primary'}
                            sx={{marginRight: '5px'}}
                          />
                          <TextPrimary
                            text={
                              getIntlDateFromString(
                                formatDate,
                                certificate?.start_date,
                              ) +
                              ` ${messages['certificate.to']} ` +
                              getIntlDateFromString(
                                formatDate,
                                certificate?.end_date,
                              )
                            }
                          />
                        </Grid>
                        <VerticalLine/>
                      </React.Fragment>
                    )}
                    {certificate?.location && (
                      <Grid item sx={{display: 'flex'}}>
                        <LocationOnIcon
                          color={'primary'}
                          sx={{marginRight: '5px'}}
                        />
                        <TextPrimary text={certificate.location}/>
                      </Grid>
                    )}
                    {
                      certificate?.is_educ_institute_certificate ? (
                        <Grid item xs={12} mt={1}>
                          {
                            certificate?.row_status == 1 && (
                              <CustomChipApprovalStatus value={2} variant={'filled'}/>
                            )
                          }
                          {
                            certificate?.row_status == 3 &&(
                              <CustomChipApprovalStatus value={3} variant={'filled'}/>
                            )
                          }
                          {
                            certificate?.row_status == 2 && (
                              <CustomChipApprovalStatus value={1} variant={'filled'}/>
                            )
                          }
                        </Grid>

                      ): ''
                    }
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  {(certificate?.certificate_file_path ||
                    certificate?.certificate_issued_id) && (
                    <Link
                      href={
                        certificate?.certificate_file_path
                          ? FILE_SERVER_FILE_VIEW_ENDPOINT +
                          certificate.certificate_file_path
                          : learnerDomain() +
                          LINK_FRONTEND_LEARNER_CERTIFICATE_VIEW +
                          certificate.certificate_issued_id
                      }
                      target={'_blank'}
                      style={{marginRight: '10px'}}>
                      <IconButton
                        color='primary'
                        aria-label='view certificate'
                        component='span'>
                        <VisibilityIcon/>
                      </IconButton>
                    </Link>
                  )}
                  {!certificate?.certificate_issued_id && (
                    <CustomParabolaButton
                      buttonVariant={'outlined'}
                      title={messages['common.edit_btn'] as string}
                      icon={<BorderColor/>}
                      onClick={() => {
                        onEditClick(certificate.id);
                      }}
                      disabled={disabled || (certificate?.row_status == 1 && certificate?.is_educ_institute_certificate == 1)}
                    />
                  )}
                  {!certificate?.certificate_issued_id && !disabled ? (
                    <CustomConfirmationButton
                      confirmAction={async () => {
                        await onDeleteClick(certificate.id);
                      }}
                      buttonType={'delete'}
                      dialogTitle={
                        messages['confirmation_text.certificate'] as string
                      }
                      disabled={disabled || (certificate?.row_status == 1 && certificate?.is_educ_institute_certificate == 1)}
                    />
                  ) : (
                    <span style={{paddingLeft: 5}}>
                      <CustomParabolaButton
                        buttonVariant={'outlined'}
                        title={messages['common.delete'] as string}
                        icon={<FiTrash2/>}
                        disabled={disabled}
                      />
                    </span>
                  )}
                </Box>
                <Grid item xs={12} sx={{m: 1, ml: 3}}>
                  <CustomCheckboxWithoutForm
                    id={`is_certificate_${certificate.id}`}
                    label={messages['common.is_show_in_cv']}
                    checked={!!showInCV[certificate.id]}
                    onChange={() => debounceFn(certificate.id)}
                    isDisabled={disabled}
                  />
                </Grid>
              </Grid>
            </StyledGrid>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default Certifications;
